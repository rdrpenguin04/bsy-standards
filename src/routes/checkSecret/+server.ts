import { config } from '$lib/server/config.js';
import { json } from '@sveltejs/kit';

function timeout(timeout: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export async function POST({ request, cookies }): Promise<Response> {
	let data: { secret: string } = await request.json();
    await timeout(700); // rate-limiting

    let pinu = cookies.get('pinu')!;
	let allowedCheck = config.allowed.includes(Number(pinu));
	let secretCheck = config.secret.toLocaleLowerCase() === data.secret.toLocaleLowerCase();
	let adminCheck = String(config.president) === pinu || String(config.recsec) === pinu;
	if (!allowedCheck) {
		return json({ status: 'unauthorized' });
	} else if (!secretCheck) {
		return json({ status: 'bad secret' });
	} else if (!adminCheck) {
		return json({ status: 'allowed' });
	} else {
		return json({ status: 'admin' });
	}
}
