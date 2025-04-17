<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Column from '$lib/components/Column.svelte';
	import { loadPolicies, Policy } from '$lib/policy.svelte';
	import { slide } from 'svelte/transition';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();
	let policies: Policy[] = $state([]);
	let unopposed_policies = $derived(policies.filter((x) => x.against == 0));
	let generally_unopposed_policies = $derived(
		policies.filter((x) => x.against != 0 && x.against < 5 && x.percent >= 0.9)
	);
	let contested_policies = $derived(
		policies.filter((x) => (x.against >= 5 || x.percent < 0.9) && x.percent > 0.3)
	);
	let generally_opposed_policies = $derived(policies.filter((x) => x.percent <= 0.3));

	onMount(async () => {
		policies = await loadPolicies();
	})

	let newPolicy = $state('');
	let newPolicyError: string | null = $state(null);
</script>

<div class="flex h-screen w-screen flex-col">
	<header>
		<div class="flex w-full flex-row items-center justify-between bg-gray-50">
			<h1 class="min-w-0 p-2 text-3xl">Beta Sigma Psi Standards</h1>
			<div class="flex min-w-0 flex-row items-center">
				<p class="p-2">Welcome, {data.displayPinu}!</p>
				<div class="p-2">
					<Button ty="a" href="/logout">Log out</Button>
				</div>
			</div>
		</div>
	</header>
	<main class="contents flex-1">
		<div class="grid h-full grid-cols-4">
			<Column name="Unopposed" policies={unopposed_policies}>
				<!-- Displayed at the top of the column; this is how we'll add new policies -->
				<div class="w-full py-2">
					<div class="rounded-xl border border-dashed p-2">
						<form
							onsubmit={(e) => {
								e.preventDefault();
								if (newPolicy.length == 0) return;
								if (policies.some((x) => x.name == newPolicy)) {
									newPolicyError = 'Someone else made that policy already';
									(document.getElementById('newPolicy') as HTMLInputElement).setCustomValidity(
										'Policy is not unique'
									);
									setTimeout(() => {
										(document.getElementById('newPolicy') as HTMLInputElement).setCustomValidity(
											''
										);
									}, 250);
								} else {
									let policy = new Policy(newPolicy, 0, 0);
									policy.vote = 1;
									policies.push(policy);
									newPolicy = '';
									newPolicyError = null;
								}
							}}
						>
							<input
								id="newPolicy"
								class="invalid:animate-shake w-full border invalid:border-red-600"
								bind:value={newPolicy}
								placeholder="New policy"
								oninput={() => {
									newPolicyError = '';
								}}
								autocomplete="off"
							/>
							{#if newPolicyError}
								<p transition:slide class="text-red-600">{newPolicyError}</p>
							{/if}
						</form>
					</div>
				</div>
			</Column>
			<Column name="Generally unopposed" policies={generally_unopposed_policies} />
			<Column name="Contested" policies={contested_policies} />
			<Column name="Generally opposed" policies={generally_opposed_policies} />
		</div>
	</main>
</div>
