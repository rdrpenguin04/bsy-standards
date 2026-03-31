<script lang="ts">
	import Column from '$lib/components/Column.svelte';
	import { loadPolicies, Policy } from '$lib/policy.svelte';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	let policies: Policy[] = $state([]);
	let unopposed_policies = $derived(policies.filter((x) => x.against == 0));
	let generally_unopposed_policies = $derived(
		policies.filter((x) => x.against != 0 && x.against < 5 && x.percent >= 0.85)
	);
	let contested_policies = $derived(
		policies.filter((x) => (x.against >= 5 || x.percent < 0.85) && x.percent > 0.3)
	);
	let generally_opposed_policies = $derived(policies.filter((x) => x.percent <= 0.3));

	onMount(async () => {
		policies = await loadPolicies();
	});

	let newPolicy = $state('');
	let newPolicyError: string | null = $state(null);
</script>

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
								(document.getElementById('newPolicy') as HTMLInputElement).setCustomValidity('');
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
