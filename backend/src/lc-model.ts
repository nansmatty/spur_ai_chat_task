import { ChatOpenAI } from '@langchain/openai';
import { loadEnv } from './config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';

export type Provider = 'openai' | 'gemini' | 'groq';

export function createChatModel(): { provider: Provider; model: any } {
	loadEnv();

	const provider = (process.env.PROVIDER || '').toLowerCase();

	const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
	const hasGeminiKey = !!process.env.GOOGLE_API_KEY;
	const hasGroqKey = !!process.env.GROQ_API_KEY;

	const base = { temperature: 0 as const };

	if (provider === 'openai' || (!provider && hasOpenAIKey)) {
		return {
			provider: 'openai',
			model: new ChatOpenAI({ ...base, model: 'gpt-4o-mini' }),
		};
	}

	if (provider === 'gemini' || (!provider && hasGeminiKey)) {
		return {
			provider: 'gemini',
			model: new ChatGoogleGenerativeAI({ ...base, model: 'gemini-2.5-flash-lite' }),
		};
	}

	if (provider === 'groq' || (!provider && hasGroqKey)) {
		return {
			provider: 'groq',
			model: new ChatGroq({ ...base, model: 'llama-3.1-8b-instant' }),
		};
	}

	return {
		provider: 'gemini',
		model: new ChatGoogleGenerativeAI({ ...base, model: 'gemini-2.0-flash-lite', maxOutputTokens: 2048 }),
	};
}
