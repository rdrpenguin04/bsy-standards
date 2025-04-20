import { type PolicyRaw } from '$lib/policy.svelte';
import { readFile, writeFile } from 'fs/promises';

export let policies: Map<string, Map<string, number>> = new Map([
	[
		'Members must attend Chapter unless they provide a reason ahead of time.',
		new Map([['1033', 1]])
	]
]);

loadPoliciesFromDisk();

export function policiesForPinu(pinu: string): PolicyRaw[] {
	return policies
		.entries()
		.map(([name, votes]) => {
			let result = { name: name, favor: 0, against: 0, vote: 0 };
			for (let vote of votes) {
				if (vote[0] == pinu) {
					result.vote = vote[1];
				}
				if (vote[1] == 1) {
					result.favor++;
				}
				if (vote[1] == -1) {
					result.against++;
				}
			}
			return result;
		})
		.toArray();
}

async function loadPoliciesFromDisk(): Promise<void> {
	try {
		let input: { [key: string]: { [key: string]: number } } = JSON.parse(
			await readFile('policies.json')
		);
		let result = new Map();
		for (let name in input) {
			let inputVotes = input[name];
			let votes = new Map();
			for (let pinu in inputVotes) {
				let vote = inputVotes[pinu];
				votes.set(pinu, vote);
			}
			result.set(name, votes);
		}
		policies = result;
	} catch (e) {
		console.log('info: creating new policies file upon next save');
	}
}

let saveTimeout: number | null = null;

// Queues save to happen in five seconds in case many actions are happening rapidly
export function savePolicies() {
	if (saveTimeout) {
		clearTimeout(saveTimeout);
	}
	saveTimeout = setTimeout(() => {
		saveTimeout = null;
		let result: { [key: string]: { [key: string]: number } } = {};
		for (let [name, votes] of policies.entries()) {
			result[name] = {};
			for (let [pinu, vote] of votes.entries()) {
				result[name][pinu] = vote;
			}
		}
		writeFile('policies.json', JSON.stringify(result));
	}, 5000);
}
