import { auditLog, saveAuditLog } from '$lib/server/auditLog';
import { config } from '$lib/server/config';
import { policies, savePolicies } from '$lib/server/policies';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }): Promise<Response> {
	let data: { name: string; reason: string; secret: string } = await request.json();
	let allowedCheck = config.allowed.includes(Number(cookies.get('pinu')!));
	let secretCheck = config.secret.toLocaleLowerCase() === data.secret.toLocaleLowerCase();
	if (!allowedCheck || !secretCheck) {
		return new Response(
			JSON.stringify({
				body:
					'not authorized: ' + (!allowedCheck ? 'not in approved member list' : 'invalid secret')
			}),
			{
				status: 403,
				headers: { 'content-type': 'application/json' }
			}
		);
	}
	auditLog.push({ op: 'deletePolicy', policy: data.name, reason: data.reason });
	saveAuditLog();
	policies.delete(data.name);
	savePolicies();
	return json('OK');
}
