import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { generateObject } from 'ai';

const CtaSchema = z.object({
	ctaType: z.union([
		z.literal('CODE').describe('Examples: Verfication code, OTP etc..'),
		z.literal('LINK').describe('Examples: Reset password link, email verification link'),
		z.literal('NONE').describe('Use this when there is no CTA in the email or there is no CTA in the email'),
	]),
	cta: z.string().optional(),
});

export async function getCta(content: string, { openAiKey }: { openAiKey?: string }) {
	try {
		if (!openAiKey) {
			return { ctaType: 'NONE' as const };
		}

		const openai = createOpenAI({ apiKey: openAiKey, compatibility: 'strict' });

		const { object } = await generateObject({
			model: openai('gpt-4o-mini'),
			schema: CtaSchema,
			maxRetries: 3,

			messages: [
				{
					role: 'system',
					content: `The message below is an email. Based on the content choose proper cta and it's content.
					1. Incase the email does not contain any CTA choose the ctaType to be 'NONE'.
					2. Incase the CTA is to copy paste a code choose the ctaType to be 'CODE'.
					3. Incase the CTA is to click on a link choose the ctaType to be 'LINK'.
					`,
				},
				{
					role: 'user',
					content: content,
				},
			],
		});

		console.log(object);

		return object;
	} catch (error) {
		console.error(error);
		return { ctaType: 'NONE' as const };
	}
}
