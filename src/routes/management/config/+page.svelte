<script lang="ts">
	// import Button from '$lib/components/Button.svelte';
	import { BLANK_CONFIG, loadConfig, type Config } from '$lib/config.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let config: Config = $state(BLANK_CONFIG);
	let status: string = $state('');
	let secret: string = $state('');

	onMount(async () => {
		config = await loadConfig();
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

	async function updateStatus2() {
		status = 'updating';
		fetch('/saveConfig', {
			method: 'POST',
			body: JSON.stringify({ secret, newConfig: config.jsonify() }),
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
		{:else if status === 'updating'}
			<p>Updating...</p>
		{:else if status === 'done'}
			<p>Done!</p>
		{/if}
	</form>
</div>

{#if status === 'admin' || status === 'updating' || status === 'done'}
	<div class="p-2" transition:slide>
		<div>
			Page under construction; come back later for more features! (or talk to Ray if you want it
			done sooner)
		</div>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				updateStatus2();
			}}
		>
			<input
				placeholder="Message of the day"
				bind:value={config.motd}
				onkeydown={() => (status = 'admin')}
			/>
		</form>
	</div>
{/if}
