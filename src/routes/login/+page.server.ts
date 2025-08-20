import { config } from '$lib/server/config';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ cookies, request, url }) => {
		const data = await request.formData();
		const pinu = data.get('pinu') as string;
		cookies.set('pinu', pinu, { path: '/' });
		if (String(config.president) === pinu || String(config.recsec) === pinu) {
			cookies.set('role', 'admin', { path: '/' });
		} else if (config.allowed.includes(Number(pinu))) {
			cookies.set('role', 'mod', { path: '/' });
		} else {
			cookies.set('role', 'normie', { path: '/' });
		}
		redirect(303, url.searchParams.get('ret') || '/');
	}
};
