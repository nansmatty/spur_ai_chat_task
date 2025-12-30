import { randomUUID } from 'crypto';
import { db } from './database';

export function createConversation(): string {
	const id = randomUUID();
	db.prepare('INSERT INTO conversations (id) VALUES (?)').run(id);
	return id;
}

export function conversationsExists(conversationId: string): boolean {
	const row = db.prepare('SELECT 1 FROM conversations WHERE id = ?').get(conversationId);
	return !!row;
}

export function saveMessage(conversationId: string, role: 'user' | 'assistant', content: string): void {
	const id = randomUUID();
	db.prepare('INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)').run(id, conversationId, role, content);
}

export function getMessages(conversationId: string) {
	return db.prepare(`SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`).all(conversationId) as {
		role: 'user' | 'assistant';
		content: string;
	}[];
}
