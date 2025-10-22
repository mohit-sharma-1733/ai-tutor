# AI Tutor Whiteboard

This project provides a full-stack setup for an AI-powered tutoring experience that combines a NestJS backend with a Next.js frontend. The system calls Azure OpenAI to produce real-time whiteboard drawing commands and synchronized narration for an engaging lesson experience.

## Project Structure

```
.
├── backend/   # NestJS application proxying Azure OpenAI
├── frontend/  # Next.js application rendering the whiteboard and narration
└── README.md
```

## Requirements

- Node.js 18+
- pnpm, npm, or yarn (examples below use `npm`)
- Azure OpenAI resource with a deployment that supports chat completions

## Backend Setup (`backend/`)

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Copy the example environment file and populate it with your Azure credentials:
   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   | --- | --- |
   | `AZURE_OPENAI_ENDPOINT` | Base URL for your Azure OpenAI resource (e.g., `https://your-resource.openai.azure.com`). |
   | `AZURE_OPENAI_API_KEY` | API key with access to the deployment. |
   | `AZURE_OPENAI_DEPLOYMENT_NAME` | Name of the Azure OpenAI deployment to target. |
   | `PORT` | Optional port override (default: `3001`). |

3. Start the NestJS server:
   ```bash
   npm run start:dev
   ```

### Backend API

`POST /drawing/session`

Request body:
```json
{
  "prompt": "Explain the Pythagorean theorem",
  "maxTokens": 800,
  "temperature": 0.7
}
```

Expected response:
```json
{
  "drawing": {
    "commands": [
      {
        "type": "stroke",
        "points": [
          { "x": 120, "y": 340 },
          { "x": 220, "y": 340 }
        ],
        "color": "#1d4ed8",
        "lineWidth": 4,
        "delayMs": 300
      }
    ]
  },
  "narration": [
    { "text": "Let's draw a right triangle.", "delayMs": 400 }
  ]
}
```

The service expects Azure OpenAI to return JSON that adheres to this schema. The backend validates configuration, forwards the prompt, and normalizes the JSON before returning it to the client.

## Frontend Setup (`frontend/`)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Configure the backend URL for local development:
   ```bash
   cp .env.example .env.local
   ```
   Update `NEXT_PUBLIC_BACKEND_URL` if the backend runs on a different host or port.
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Frontend Behavior

- The home page provides a prompt input for lesson requests.
- Submitting the form calls the internal Next.js API route (`/api/session`), which proxies the request to the NestJS backend.
- Drawing commands are rendered sequentially on a `<canvas>` element, simulating real-time strokes.
- Narration text is displayed alongside the canvas. When available, the browser's Speech Synthesis API will voice each narration segment with delays between sentences.

## Running Both Services

In separate terminals:

```bash
# Terminal 1
cd backend
npm run start:dev

# Terminal 2
cd frontend
npm run dev
```

Ensure the backend is running before interacting with the frontend so API calls succeed.

## Additional Notes

- The backend uses the NestJS `ConfigModule` to load environment variables from `.env` files.
- For production, configure secure storage for API keys and consider enabling authentication and rate limiting.
- The placeholder Azure OpenAI deployment name (`gpt-4o-realtime-preview`) can be replaced with any deployment that returns JSON-formatted chat completions.
