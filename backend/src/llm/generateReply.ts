import { createChatModel } from './lc-model';
import { SYSTEM_PROMPT } from './systemPrompt';

export type ChatMessage = {
	role: 'user' | 'assistant';
	content: string;
};

export async function generateReply(history: ChatMessage[]): Promise<string> {
	const { model } = createChatModel();

	const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...history.map((msg) => ({ role: msg.role, content: msg.content }))];

	try {
		const result = await model.invoke(messages);
		const text =
			typeof result.content === 'string'
				? result.content
				: Array.isArray(result.content)
				? result.content.map((part: any) => part.text).join('')
				: '';

		if (!text.trim()) {
			throw new Error('Empty response from LLM');
		}

		return text.trim();
	} catch (error) {
		console.error('LLM generation error:', error);
		throw new Error(`The support agent is currently unavailable. Please try again later.`);
	}
}
