import { policiesForPinu } from '$lib/server/policies';
import { json } from '@sveltejs/kit';

export function GET({ cookies }) {
	return json(policiesForPinu(cookies.get('pinu')!));
}
