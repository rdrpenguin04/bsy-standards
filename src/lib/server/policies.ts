import type { PolicyRaw } from '$lib/policy.svelte';

export let policies: Map<string, Map<string, number>> = new Map([
	[
		'Members must attend Chapter unless they provide a reason ahead of time.',
		new Map([['1024', 1]])
	]
]);

export function policiesForPinu(pinu: string): PolicyRaw[] {
	return policies.entries().map(([name, votes]) => {
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
	}).toArray();
}
