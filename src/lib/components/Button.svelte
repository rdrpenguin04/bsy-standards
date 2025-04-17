<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	let {
		children,
		ty,
		...rest
	}: { children: any; ty?: any } & HTMLButtonAttributes & HTMLAnchorAttributes = $props();
</script>

{#if !ty || ty == 'button'}
	<button {...rest} class="cursor-pointer rounded-lg border px-2 py-1">
		{@render children?.()}
	</button>
{:else}
	<a {...rest} class="cursor-pointer rounded-lg border px-2 py-1">
		{@render children?.()}
	</a>
{/if}
