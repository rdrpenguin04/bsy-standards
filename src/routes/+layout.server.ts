import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	if (!cookies.get('pinu') && url.pathname != '/login') {
		redirect(303, `/login?ret=${url.pathname}`);
	}

	return {
		displayPinu: isNaN(Number(cookies.get('pinu')))
			? cookies.get('pinu')
			: 'E-' + cookies.get('pinu')
	};
};
