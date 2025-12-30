import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:6001';

export async function POST(req: Request) {
	try {
		const askBody = await req.json();
		const apiResponse = await fetch(`${BACKEND_URL}/ask`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(askBody),
		});

		const data = await apiResponse.json();

		return NextResponse.json(data, { status: apiResponse.status });
	} catch (error) {
		return NextResponse.json({
			error: `Some error occurred. ${error}`,
		});
	}
}
