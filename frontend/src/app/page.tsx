'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormEvent, useRef, useState } from 'react';

type ChatMessage = {
	role: 'user' | 'assistant';
	content: string;
};

export default function Home() {
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [sessionId, setSessionId] = useState<string | null>(null);

	const formRef = useRef<HTMLFormElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	async function handleQuerySubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const text = query.trim();
		if (!text || loading) return;

		setLoading(true);
		setQuery('');

		setMessages((prev) => [...prev, { role: 'user', content: text }]);

		try {
			const res = await fetch('/api/chat/message', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: text, sessionId }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'An error occurred while fetching the response.');
			}

			setSessionId(data.sessionId);
			setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
		} catch (e) {
			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content: 'Sorry, something went wrong. Please try again.',
				},
			]);
		} finally {
			setLoading(false);
			inputRef.current?.focus();
		}
	}

	return (
		<div className='min-h-dvh w-full bg-zinc-50'>
			<div className='mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-24 pt-8'>
				<header className='mb-4'>
					<h1 className='text-xl font-semibold tracking-tight'>Hello Agent - Ask anything</h1>
				</header>

				<Card className='flex-1'>
					<CardHeader>
						<CardTitle>Answers</CardTitle>
					</CardHeader>

					<CardContent className='space-y-3'>
						{messages.length === 0 ? (
							<p className='text-sm text-zinc-600'>No messages yet. Ask a question below.</p>
						) : (
							messages.map((msg, index) => (
								<div
									key={index}
									className={`rounded-xl p-3 text-sm leading-6 ${
										msg.role === 'user' ? 'ml-auto max-w-[80%] bg-black text-white' : 'mr-auto max-w-[80%] bg-zinc-100 text-black'
									}`}>
									{msg.content}
								</div>
							))
						)}
					</CardContent>
				</Card>
				<form ref={formRef} onSubmit={handleQuerySubmit} className='fixed inset-x-0 bottom-0 mx-auto w-full max-w-2xl px-4 py-4 backdrop-blur-md'>
					<div className='flex gap-2'>
						<Input
							ref={inputRef}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder='Type your questions and press'
							disabled={loading}
							className='h-11'
						/>
						<Button type='submit' disabled={loading} className='h-11'>
							{loading ? 'Thinking...' : 'Ask'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
