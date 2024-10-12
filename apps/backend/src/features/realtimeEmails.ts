import { Connection, getServerByName, Server } from 'partyserver';
import { EmailRow, EmailTable } from '../db/email';
import { DurableObject } from 'cloudflare:workers';

export class RealtimeEmails extends Server<Env> implements DurableObject {
	async onStart() {
		const roomName = this.name;

		const EmailDao = new EmailTable(this.env.DB);

		const allEmails = await EmailDao.getEmails(roomName);

		const allEmailsInObject = allEmails.reduce((acc: Record<string, EmailRow>, cur) => {
			const id = `${cur.id}`;
			acc[id] = cur;

			return acc;
		}, {});

		this.ctx.storage.put(allEmailsInObject);

		return;
	}

	async onConnect(connection: Connection) {
		const allEmails = await this.ctx.storage.list();

		console.log({ allEmails, room: this.name });

		const allEmailsInArray = Array.from(allEmails.values());

		connection.send(JSON.stringify(allEmailsInArray));
	}

	async newEmails(emails: EmailRow[]) {
		const emailsInObject = emails.reduce((acc: Record<string, EmailRow>, curr) => {
			const id = `${curr.id}`;
			acc[id] = curr;

			return acc;
		}, {});

		this.ctx.storage.put(emailsInObject);

		this.broadcast(JSON.stringify(emailsInObject));
	}

	async deleteEmails(ids: number[]) {
		console.log({ ids, room: this.name, message: 'deleteEmails' });
		return this.ctx.storage.delete(ids.map((id) => `${id}`));
	}
}

export async function broadcastEmails(emails: EmailRow[], env: Env) {
	const nameToEmails = new Map<string, EmailRow[]>();

	for (const email of emails) {
		const name = email.to.replace(`@maailit.com`, '');

		if (nameToEmails.has(name)) {
			const existingEmails = nameToEmails.get(name)!;
			existingEmails.push(email);
		} else {
			nameToEmails.set(name, [email]);
		}
	}

	const allPromises: Array<Promise<unknown>> = [];
	for (const [name, emails] of nameToEmails) {
		const prms = broadcastToEmailRoom({ name, emails, env });

		allPromises.push(prms);
	}

	return Promise.all(allPromises);
}

async function broadcastToEmailRoom({ emails, env, name }: { name: string; emails: EmailRow[]; env: Env }) {
	const stub = await getServerByName(env.RealtimeEmails, name);

	return stub.newEmails(emails);
}

export async function deleteEmailsFromRooms(emails: { id: number; to: string }[], env: Env) {
	const nameToEmails = new Map<string, number[]>();

	for (const email of emails) {
		const name = email.to.replace(`@maailit.com`, '');

		if (nameToEmails.has(name)) {
			const existingEmails = nameToEmails.get(name)!;
			existingEmails.push(email.id);
		} else {
			nameToEmails.set(name, [email.id]);
		}
	}
	const allPromises: Array<Promise<unknown>> = [];
	for (const [name, emails] of nameToEmails) {
		const prms = deleteEmailsFromRoom({ name, ids: emails, env: env });

		allPromises.push(prms);
	}
	return Promise.all(allPromises);
}

async function deleteEmailsFromRoom({ ids, env, name }: { name: string; ids: number[]; env: Env }) {
	const stub = await getServerByName(env.RealtimeEmails, name);

	return stub.deleteEmails(ids);
}
