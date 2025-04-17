import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ cookies, request, url }) => {
		const data = await request.formData();
		cookies.set('pinu', data.get('pinu') as string, { path: '/' });
		redirect(303, url.searchParams.get('ret') || '/');
	}
};
