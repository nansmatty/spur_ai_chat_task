import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:6001';

export async function POST(req: Request) {
	try {
		const messageBody = await req.json();
		const apiResponse = await fetch(`${BACKEND_URL}/chat/message`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(messageBody),
		});
		const data = await apiResponse.json();
		return NextResponse.json(data, { status: apiResponse.ok ? 200 : apiResponse.status });
	} catch (error) {
		return NextResponse.json({ error: 'Failed to reach chat service' }, { status: 500 });
	}
}
