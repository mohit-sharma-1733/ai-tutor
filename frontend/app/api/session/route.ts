import { NextResponse } from 'next/server';
import { requestDrawingSession } from '../../../lib/api';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = await requestDrawingSession(payload);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[api/session] Failed to proxy drawing session request', error);
    return NextResponse.json(
      {
        message: 'Unable to generate drawing session. Please try again later.',
      },
      { status: 500 },
    );
  }
}
