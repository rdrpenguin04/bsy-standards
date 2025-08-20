<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { loadPolicies, type Policy } from '$lib/policy.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let policies: Policy[] = $state([]);
	let users: { name: string; numVotes: number }[] = $state([]);
	let secret: string = $state('');
	let status: string = $state('');
	$effect(() => {
		if (status === 'unauthorized') {
			// Hey, you're not supposed to be here!
			goto('/logout');
		}
	});

	onMount(async () => {
		policies = await loadPolicies();
	});

	onMount(async () => {
		users = await loadUsers();
	});

	async function loadUsers(): Promise<{ name: string; numVotes: number }[]> {
		return JSON.parse(await (await fetch('/users')).json());
	}

	onMount(async () => {
		if (secret != '') {
			await updateStatus();
		}
	});

	async function updateStatus() {
		status = 'checking';
		fetch('/checkSecret', {
			method: 'POST',
			body: JSON.stringify({ secret }),
			headers: {
				'content-type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((body) => {
				status = body.status;
				if (status === 'bad secret') {
					let element = document.getElementById('secretPhrase') as HTMLInputElement;
					element.setCustomValidity('bad secret');
					setTimeout(() => element.setCustomValidity(''), 250);
				}
			});
	}
</script>

<div class="inline-block p-2">
	<form
		onsubmit={(e) => {
			e.preventDefault();
			updateStatus();
		}}
	>
		<input
			id="secretPhrase"
			class="invalid:animate-shake w-80 border invalid:border-red-600"
			placeholder="Secret phrase"
			bind:value={secret}
		/>
		{#if status === 'bad secret'}
			<p class="text-red-600">Invalid secret</p>
		{:else if status === 'checking'}
			<p>Checking...</p>
		{:else if status === 'admin'}
			<Button ty="a" class="pl-2" href="/management/config">Edit config</Button>
		{/if}
	</form>
</div>

{#if status === 'allowed' || status === 'admin'}
	<div class="grid grid-cols-2 p-2" transition:slide>
		<div class="m-2 h-full max-h-full flex-col rounded-xl border-2 p-2">
			<h2 class="text-xl">Users</h2>
			<div class="overflow-y-scroll">
				<div class="flex flex-col">
					{#each users as user (user.name)}
						<div class="my-2 w-full rounded-xl border p-2" transition:slide>
							<p>{user.name}</p>
							<p>
								Voted on {user.numVotes}
								{user.numVotes === 1 ? 'policy' : 'policies'} ({Number(
									user.numVotes / policies.length
								).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 })})
							</p>
							<button
								class="cursor-pointer rounded-md border px-2 text-red-700"
								onclick={() => {
									if (confirm(`Really delete the votes of "${user.name}"?`)) {
										fetch('/deleteUser', {
											method: 'POST',
											body: JSON.stringify({ name: user.name, secret }),
											headers: {
												'content-type': 'application/json'
											}
										}).then((response) => {
											if (response.status != 200) {
												response.json().then((body) => alert(`authentication error: ${body.body}`));
											} else {
												users = users.filter((u) => u.name != user.name);
											}
										});
									}
								}}
							>
								Delete
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="m-2 h-full max-h-full flex-col rounded-xl border-2 p-2">
			<h2 class="text-xl">Policies</h2>
			<div class="overflow-y-scroll">
				<div class="flex flex-col">
					{#each policies.toReversed() as policy (policy.name)}
						<div class="my-2 w-full rounded-xl border p-2" transition:slide>
							<p>{policy.name}</p>
							<p>
								Support: {policy.favor} against {policy.against} ({Number(
									policy.favor / (policy.favor + policy.against)
								).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 })})
							</p>
							<button
								class="cursor-pointer rounded-md border px-2 text-red-700"
								onclick={() => {
									if (confirm(`Really delete "${policy.name}"?`)) {
										fetch('/deletePolicy', {
											method: 'POST',
											body: JSON.stringify({ name: policy.name, secret }),
											headers: {
												'content-type': 'application/json'
											}
										}).then((response) => {
											if (response.status != 200) {
												response.json().then((body) => alert(`authentication error: ${body.body}`));
											} else {
												policies = policies.filter((p) => p.name != policy.name);
											}
										});
									}
								}}
							>
								Delete
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
