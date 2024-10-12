import { Connection, Server } from 'partyserver';
import { EmailRow, EmailTable } from '../db/email';
import { DurableObject } from 'cloudflare:workers';

export class RealtimeEmails extends Server implements DurableObject {
	env: Env;
	state: DurableObjectState;

	constructor(state: DurableObjectState, env: Env) {
		super(state, env);

		this.env = env;
		this.state = state;
	}

	async onStart() {
		const roomName = this.name;

		const EmailDao = new EmailTable(this.env.DB);

		const allEmails = await EmailDao.getEmails(roomName);

		const allEmailsInObject = allEmails.reduce((acc: Record<string, EmailRow>, cur) => {
			const id = `${cur.id}`;
			acc[id] = cur;

			return acc;
		}, {});

		await this.state.storage.put(allEmailsInObject);

		return;
	}

	async onConnect(connection: Connection) {
		const allEmails = await this.state.storage.list();

		console.log({ allEmails, room: this.name });

		const allEmailsInArray = Array.from(allEmails.values());

		connection.send(JSON.stringify(allEmailsInArray));
	}
}
