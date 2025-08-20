import { policies } from '$lib/server/policies';
import { json } from '@sveltejs/kit';

export function GET({ cookies }): Response {
	if (cookies.get('role')! !== 'normie') {
		let users: Map<string | number, number> = new Map();
		for (const [_, policy] of policies) {
			for (const [user, vote] of policy) {
				if (vote !== 0) {
					users.set(user, (users.get(user) || 0) + 1);
				}
			}
		}
		let usersArray = Array.from(users.entries());
		usersArray.sort(([a, _a], [b, _b]) => {
			if (Number.isNaN(Number(a)) && Number.isNaN(Number(b))) {
				return a < b ? -1 : a === b ? 0 : 1;
			} else if (!Number.isNaN(Number(a)) && !Number.isNaN(Number(b))) {
				return Number(a) - Number(b);
			} else if (!Number.isNaN(Number(a))) {
				// pins before associates
				return -1;
			} else {
				// associates after pins
				return 1;
			}
		});
		let finalArray = usersArray.map(([name, numVotes]) => {
			if (!Number.isNaN(Number(name))) {
				return { name: 'E-' + name, numVotes };
			} else {
				return { name, numVotes };
			}
		});
		return json(JSON.stringify(finalArray));
	} else {
		return json({ status: 'nope' });
	}
}
