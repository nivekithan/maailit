import { Hono } from 'hono';
import { EmailTable } from '../db/email';

export const emailRouter = new Hono<{ Bindings: Env }>();

emailRouter.get('/:email', async (c) => {
	const email = c.req.param('email');

	const EmailDao = new EmailTable(c.env.DB);

	const allEmails = await EmailDao.getEmails(email);

	return Response.json(allEmails);
});
