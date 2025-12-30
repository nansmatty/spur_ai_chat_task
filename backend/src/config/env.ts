import dotenv from 'dotenv';
dotenv.config();

import { z } from 'zod';

const EnvSchema = z.object({
	PORT: z.string().default('6001'),
	ALLOWED_ORIGIN: z.string().optional(),

	OPENAI_MODEL: z.string().default('gpt-4o-mini'),
	GEMINI_MODEL: z.string().default('gemini-2.0-flash-lite'),

	OPENAI_API_KEY: z.string().optional(),
	GOOGLE_API_KEY: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
	console.error(parsed.error.format());
	throw new Error('Invalid environment variables');
}

const raw = parsed.data;

export const env = Object.freeze({
	PORT: Number(raw.PORT),
	ALLOWED_ORIGIN: raw.ALLOWED_ORIGIN ?? '*',

	OPENAI_API_KEY: raw.OPENAI_API_KEY,
	OPENAI_MODEL: raw.OPENAI_MODEL,

	GOOGLE_API_KEY: raw.GOOGLE_API_KEY,
	GEMINI_MODEL: raw.GEMINI_MODEL,
});
