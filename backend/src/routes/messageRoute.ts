import { Router } from 'express';
import { conversationsExists, createConversation, getMessages, saveMessage } from '../db/repository';
import { generateReply } from '../llm/generateReply';

export const messageRouter = Router();

messageRouter.post('/message', async (req, res) => {
	try {
		const { message, sessionId } = req.body ?? {};

		if (!message || !String(message).trim()) {
			return res.status(400).json({ error: 'Invalid message.' });
		}

		let conversationId = sessionId;

		if (!conversationId || !conversationsExists(conversationId)) {
			conversationId = createConversation();
		}

		saveMessage(conversationId, 'user', message);

		const history = getMessages(conversationId);

		const reply = await generateReply(history);

		saveMessage(conversationId, 'assistant', reply);

		return res.status(200).json({ reply, sessionId: conversationId });
	} catch (error: any) {
		console.error('Chat error:', error);
		return res.status(500).json({
			error: 'Something went wrong while generating the reply.',
		});
	}
});
