<script lang="ts">
	let pinu = $state('');

	function canonicalPinu(pinu: string): string {
		let lowercase = pinu.toLowerCase();
		if (lowercase.startsWith('e-')) {
			return pinu.slice(2);
		} else if (lowercase.startsWith('e ')) {
			return pinu.slice(2);
		} else if (lowercase.startsWith('e')) {
			return pinu.slice(1);
		}
		return pinu;
	}

	let pinuData: { message?: string; isError: boolean; value?: number } = $derived.by(() => {
		let canonical = canonicalPinu(pinu);
		if (canonical == '2^10' || canonical == '0x400') {
			return { isError: false, message: 'Hello, Marcus.', value: Number(canonical) };
		} else if (canonical.length == 0) {
			return { isError: false }; // no value
		} else if (isNaN(Number(canonical)) || !Number.isInteger(Number(canonical))) {
			return { isError: true, message: 'Not a valid pin number' };
		}
		return { isError: false, value: Number(canonical) };
	});

	let name = $state('');

	let nameData: string = $derived.by(() => {
		let lastSpaceIndex = name.lastIndexOf(' ');
		if (name.length == 0) return name;
		let uppercaseFirstLetter = name.charAt(0).toUpperCase();
		let usedName = name;
		if (name.charAt(0) != uppercaseFirstLetter) {
			usedName = uppercaseFirstLetter + name.slice(1);
		}
		if (lastSpaceIndex != -1) {
			let names = usedName.split(' ');
			if (names[names.length - 1].length != 0) {
				return names[0] + ' ' + names[names.length - 1].charAt(0).toUpperCase();
			} else {
				return names[0];
			}
		}
		return usedName;
	});

	function submit(source?: string) {
		let pinu =
			source == 'actives'
				? String(pinuData.value)
				: source == 'associates'
					? nameData
					: pinuData.value
						? String(pinuData.value)
						: nameData;

		let formElement = document.getElementById('submission-form')! as HTMLFormElement;
        (formElement.firstElementChild as HTMLInputElement).value = pinu;

		formElement.submit();
	}
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center">
	<h1 class="text-6xl">Log in</h1>
	<div class="flex flex-row">
		<div class="flex-1 p-2">
			<h2 class="text-center text-3xl">Actives</h2>
			<form
				onsubmit={(e) => {
					submit('actives');
					e.preventDefault();
				}}
			>
				<input placeholder="Pin number" bind:value={pinu} />
			</form>
			<p class={{ 'text-center text-sm': true, 'text-red-600': pinuData.isError }}>
				{pinuData.message ||
					(pinuData.value && pinu != String(pinuData.value) ? `(using ${pinuData.value})` : '')}
			</p>
		</div>
		<div class="flex-1 p-2">
			<h2 class="text-center text-3xl">Associates</h2>
			<form
				onsubmit={(e) => {
					submit('associates');
					e.preventDefault();
				}}
			>
				<input placeholder="Name" bind:value={name} />
			</form>
			<p class="text-center text-sm">{name != nameData ? `(using ${nameData})` : ''}</p>
		</div>
	</div>
	<form
		onsubmit={(e) => {
			submit();
			e.preventDefault();
		}}
	>
		<button class="cursor-pointer rounded-lg border px-2 py-1">Log in</button>
	</form>
</div>

<form class="hidden" id="submission-form" method="POST"><input name="pinu" /></form>
