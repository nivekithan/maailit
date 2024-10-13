import EmailParser from 'postal-mime';
import { Hono } from 'hono';
import { emailRouter } from './router/email';
import { emailTable } from './db/schema';
import { getDb } from './db/utils';
import pLimit from 'p-limit';
import { getCta } from './features/getCta';
import { routePartykitRequest } from 'partyserver';
import { broadcastEmails, deleteEmailsFromRooms, RealtimeEmails } from './features/realtimeEmails';
import { EmailTable } from './db/email';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

app.post('/test/:email', async (c) => {
	const email = c.req.param('email');

	const fromAddress = `${crypto.randomUUID().slice(4)}@gmail.com`;
	const toAddress = `${email}@maailit.com`;
	const subject = `Test email from ${fromAddress}`;

	const emailContent = `<div dir="ltr">Click on this link to forget your password <a href="https://maailit.com/reset-password?token=123456789">https://maailit.com/reset-password?token=123456789</a></div>`;

	const fakeEmailContent: EmailQueueMessage = { from: fromAddress, to: toAddress, html: emailContent, subject: subject };

	await c.env.EMAIL_QUEUE.send(fakeEmailContent);

	return Response.json({ message: 'Test email sent' });
});

app.route('/email', emailRouter);

export default {
	async fetch(request, env, ctx) {
		const result = await routePartykitRequest<Env>(request, env as any);

		if (!result) {
			return app.fetch(request, env, ctx);
		}

		return result;
	},

	async scheduled(event, env) {
		const EmailDao = new EmailTable(env.DB);

		const deletedEmails = await EmailDao.deleteEmailsOlderThan15mins();

		console.log({ deletedEmails });

		await deleteEmailsFromRooms(deletedEmails, env);

		return;
	},
	async email(message, env) {
		const messageContent = await streamToArrayBuffer(message.raw, message.rawSize);
		const email = await EmailParser.parse(messageContent);

		const emailBody = email.html;

		if (emailBody === undefined) {
			return;
		}

		const emailContent = { html: emailBody, from: message.from, to: message.to, subject: email.subject };

		console.log(emailContent);
		await env.EMAIL_QUEUE.send(emailContent);

		return;
	},

	async queue(batch, env) {
		const db = getDb(env.DB);

		const limt = pLimit(5);

		const emailsWithCta = await Promise.all(
			batch.messages.map((message) => {
				return limt(async () => {
					const cta = await getCta(message.body.html, { openAiKey: env.OPENAI_API_KEY });
					return { ...message.body, ctaType: cta.ctaType, ctaText: cta?.cta };
				});
			}),
		);

		const insertedRows = await db
			.insert(emailTable)
			.values(
				emailsWithCta.map((email) => ({
					body: email.html,
					subject: email.subject,
					from: email.from,
					to: email.to,
					ctaType: email.ctaType,
					createdAt: new Date().toISOString(),
					ctaContent: email.ctaText,
				})),
			)
			.returning();

		await broadcastEmails(insertedRows, env);

		batch.ackAll();

		return;
	},
} satisfies ExportedHandler<Env, EmailQueueMessage>;

async function streamToArrayBuffer(stream: ReadableStream<Uint8Array>, streamSize: number) {
	let result = new Uint8Array(streamSize);
	let bytesRead = 0;
	const reader = stream.getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		result.set(value, bytesRead);
		bytesRead += value.length;
	}
	return result;
}

type EmailQueueMessage = {
	from: string;
	to: string;
	subject: string | undefined;
	html: string;
};

export { RealtimeEmails };
