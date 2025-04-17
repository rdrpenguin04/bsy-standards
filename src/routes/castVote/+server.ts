import { policies } from '$lib/server/policies';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }): Promise<Response> {
	let data: { name: string; vote: number } = await request.json();
	let policy = policies.get(data.name);
	if (policy) {
		policy.set(cookies.get('pinu')!, data.vote);
	} else {
        let policy = new Map([[cookies.get('pinu')!, data.vote]]);
        policies.set(data.name, policy);
    }
    return json("OK");
}
