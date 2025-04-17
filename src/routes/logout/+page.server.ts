import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
	cookies.delete('pinu', { path: '/' });
	redirect(303, '/login?ret=/');
}
