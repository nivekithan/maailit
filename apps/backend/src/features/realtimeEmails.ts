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
			acc[curr.id] = curr;

			return acc;
		}, {});

		this.ctx.storage.put(emailsInObject);

		this.broadcast(JSON.stringify(emailsInObject));
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
