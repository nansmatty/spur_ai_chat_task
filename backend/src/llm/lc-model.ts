import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { env } from '../config/env';

export type Provider = 'openai' | 'gemini' | 'groq';

export function createChatModel(): { provider: Provider; model: any } {
	const provider = (process.env.PROVIDER || '').toLowerCase();

	const hasOpenAIKey = !!env.OPENAI_API_KEY;
	const hasGeminiKey = !!env.GOOGLE_API_KEY;

	const base = { temperature: 0 as const };

	if (provider === 'openai' || (!provider && hasOpenAIKey)) {
		return {
			provider: 'openai',
			model: new ChatOpenAI({ ...base, model: env.OPENAI_MODEL }),
		};
	}

	if (provider === 'gemini' || (!provider && hasGeminiKey)) {
		return {
			provider: 'gemini',
			model: new ChatGoogleGenerativeAI({ ...base, model: env.GEMINI_MODEL }),
		};
	}

	return {
		provider: 'openai',
		model: new ChatOpenAI({ ...base, model: env.OPENAI_MODEL }),
	};
}
