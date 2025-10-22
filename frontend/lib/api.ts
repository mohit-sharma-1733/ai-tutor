import { DrawingSessionResponse } from '../types/drawing';

interface GeneratePayload {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export async function requestDrawingSession(payload: GeneratePayload): Promise<DrawingSessionResponse> {
  const response = await fetch(`${BACKEND_URL}/drawing/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend request failed with status ${response.status}`);
  }

  return response.json();
}
