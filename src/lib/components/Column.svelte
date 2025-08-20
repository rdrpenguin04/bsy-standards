<script lang="ts">
	import type { Policy } from '$lib/policy.svelte';
	import { slide } from 'svelte/transition';

	let { name, policies, children }: { name: string; policies: Policy[]; children?: any } = $props();
</script>

<div class="m-2 h-full max-h-full flex-col rounded-xl border-2 p-2">
	<h2 class="text-xl">{name}</h2>
	<div class="overflow-y-scroll">
		<div class="flex flex-col">
			{@render children?.()}
			{#each policies.toReversed() as policy (policy.name)}
				<div class="my-2 w-full rounded-xl border p-2" transition:slide>
					<p>{policy.name}</p>
					<div class="flex w-full flex-row items-center justify-center">
						<button
							class={{
								'cursor-pointer rounded-md border px-2': true,
								'text-green-700': policy.vote == 1
							}}
							onclick={() => {
								if (policy.vote != 1) policy.vote = 1;
								else policy.vote = 0;
							}}
						>
							+
						</button>
						<p class="px-1" title={'+' + policy.favor + '/-' + policy.against}>
							{policy.favor - policy.against}
						</p>
						<button
							class={{
								'cursor-pointer rounded-md border px-2': true,
								'text-red-700': policy.vote == -1
							}}
							onclick={() => {
								if (policy.vote != -1) policy.vote = -1;
								else policy.vote = 0;
							}}
						>
							-
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
