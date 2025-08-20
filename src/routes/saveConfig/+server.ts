import type { ConfigRaw } from '$lib/config.svelte.js';
import { config } from '$lib/server/config.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }): Promise<Response> {
	let data: { newConfig: ConfigRaw; secret: string } = await request.json();
	let requestPinu = cookies.get('pinu')!;
	if (
		(String(config.president) !== requestPinu && String(config.recsec) !== requestPinu) ||
		config.secret.toLocaleLowerCase() !== data.secret.toLocaleLowerCase()
	) {
		return new Response('not authorized', {
			status: 403,
			headers: { 'content-type': 'application/json' }
		});
	}
	config.lowPin = data.newConfig.lowPin;
	config.president = data.newConfig.president;
	config.recsec = data.newConfig.recsec;
	config.allowed = data.newConfig.allowed;
	config.secret = data.newConfig.secret;
	return json('OK');
}
