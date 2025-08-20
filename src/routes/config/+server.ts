import { config } from '$lib/server/config';
import { json } from '@sveltejs/kit';

export function GET({ cookies }) {
	if (cookies.get('role')! !== 'normie') {
		return json(JSON.stringify(config));
	} else {
		return json({ haha: 'nope' });
	}
}
