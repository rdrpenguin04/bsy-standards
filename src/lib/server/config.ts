import { type ConfigRaw } from '$lib/config.svelte';
import { readFile, writeFile } from 'fs/promises';
import { homedir } from 'os';

export let config: ConfigRaw = {
	lowPin: 1014,
	president: 1026,
	recsec: 1046,
	allowed: [1026, 1028, 1037, 1046, 1048, 1050, 1051, 1052, 1053],
	secret: "oratrice mecanique d'analyse cardinale",
	motd: "This is a test"
};

loadConfigFromFile();

async function loadConfigFromFile(): Promise<void> {
	try {
		config = JSON.parse(await readFile(await readFile(homedir() + '/.local/share/bsy-config.json')));
	} catch (e) {
		console.log('info: creating new config file upon next save');
		saveConfig()
	}
}

let saveTimeout: number | null = null;

// Queues save to happen in five seconds in case many actions are happening rapidly
export function saveConfig() {
	if (saveTimeout) {
		clearTimeout(saveTimeout);
	}
	saveTimeout = setTimeout(() => {
		saveTimeout = null;
		writeFile(homedir() + '/.local/share/bsy-config.json', JSON.stringify(config));
	}, 5000);
}
