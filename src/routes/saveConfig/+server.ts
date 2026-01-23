import type { Config } from '$lib/config.svelte.js';
import { config, saveConfig } from '$lib/server/config.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }): Promise<Response> {
	let data: { newConfig: Config; secret: string } = await request.json();
	let requestPinu = cookies.get('pinu')!;
	if (
		(String(config.president) !== requestPinu && String(config.recsec) !== requestPinu) ||
		config.secret.toLocaleLowerCase() !== data.secret.toLocaleLowerCase()
	) {
		return new Response(JSON.stringify({ status: 'bad secret' }), {
			status: 403,
			headers: { 'content-type': 'application/json' }
		});
	}
	config.lowPin = data.newConfig.lowPin;
	config.president = data.newConfig.president;
	config.recsec = data.newConfig.recsec;
	config.allowed = data.newConfig.allowed;
	config.secret = data.newConfig.secret;
	config.motd = data.newConfig.motd;
	saveConfig();
	return json({ status: 'done' });
}
