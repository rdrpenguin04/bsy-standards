<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children, data } = $props();

	let motd = $state('[loading...]');

	onMount(() => {
		setTimeout(async () => {
			motd = (await (await fetch('/motd')).json()).motd;
		}, 500);
	});
</script>

<div class="flex h-screen w-screen flex-col">
	<header>
		<div class="flex w-full flex-col items-center">
			<div class="w-full bg-gray-100"><p class="text-center">{motd}</p></div>
			<div class="flex w-full flex-row items-center justify-between bg-gray-50">
				<h1 class="min-w-0 p-2 text-3xl"><a href="/">Beta Sigma Psi Standards</a></h1>
				{#if data.displayPinu}
					<div class="flex min-w-0 flex-row items-center">
						<p class="py-2 pr-2">Welcome, {data.displayPinu}!</p>
						{#if data.role !== 'normie'}
							<div class="pr-2">
								<Button ty="a" href="/management" data-sveltekit-reload>Management console</Button>
							</div>
						{/if}
						<div class="pr-2">
							<Button ty="a" href="/logout" data-sveltekit-reload>Log out</Button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</header>
	<main class="flex-1 pb-10">
		{@render children()}
	</main>
	<footer class="fixed bottom-0 w-full bg-neutral-900">
		<p class="p-1 text-center text-xs text-white">
			Having problems with this page? Send a message to <a
				href="mailto:raydredondo@gmail.com"
				class="text-blue-300 underline"
			>
				raydredondo@gmail.com
			</a> or whoever is in charge of page maintenance nowadays.
		</p>
	</footer>
</div>
