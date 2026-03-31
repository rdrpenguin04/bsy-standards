import { readFile, writeFile } from 'fs/promises';
import { homedir } from 'os';

export type AuditLogEntry =
	| { op: 'deletePolicy'; policy: string; reason: string }
	| { op: 'deleteUser'; user: string; reason: string };

export let auditLog: Array<AuditLogEntry> = [];

loadAuditLogFromFile();

async function loadAuditLogFromFile(): Promise<void> {
	try {
		auditLog = JSON.parse(await readFile(homedir() + '/.local/share/bsy-audit-log.json'));
	} catch (e) {
		console.log('info: creating new audit log file upon next save');
		saveAuditLog();
	}
}

let saveTimeout: number | null = null;

// Queues save to happen in five seconds in case many actions are happening rapidly
export function saveAuditLog() {
	if (saveTimeout) {
		clearTimeout(saveTimeout);
	}
	saveTimeout = setTimeout(() => {
		saveTimeout = null;
		writeFile(homedir() + '/.local/share/bsy-audit-log.json', JSON.stringify(auditLog));
	}, 5000);
}
