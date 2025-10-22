'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { WhiteboardCanvas } from '../components/WhiteboardCanvas';
import type { DrawingCommand, DrawingSessionResponse, NarrationSegment } from '../types/drawing';

const DEFAULT_PROMPT = 'Explain the Pythagorean theorem with a right triangle example.';

export default function HomePage() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [commands, setCommands] = useState<DrawingCommand[]>([]);
  const [narration, setNarration] = useState<NarrationSegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentNarrationIndex, setCurrentNarrationIndex] = useState(0);

  const activeNarration = useMemo(() => narration.slice(0, currentNarrationIndex + 1), [narration, currentNarrationIndex]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let cancelled = false;
    const synth = window?.speechSynthesis;
    if (!synth) {
      return;
    }

    synth.cancel();

    const speakQueue = async () => {
      for (let i = 0; i < narration.length; i += 1) {
        if (cancelled) break;
        setCurrentNarrationIndex(i);
        const segment = narration[i];
        if (!segment?.text) continue;

        const utterance = new SpeechSynthesisUtterance(segment.text);
        synth.speak(utterance);

        await new Promise<void>((resolve) => {
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
        });

        const delay = segment.delayMs ?? 400;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      setIsPlaying(false);
    };

    speakQueue();

    return () => {
      cancelled = true;
      synth.cancel();
    };
  }, [isPlaying, narration]);

  const submitPrompt = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      setError(null);
      setIsPlaying(false);
      setCommands([]);
      setNarration([]);
      setCurrentNarrationIndex(0);

      try {
        const response = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const data: DrawingSessionResponse = await response.json();
        setCommands(data.drawing.commands);
        setNarration(data.narration);
        setIsPlaying(true);
      } catch (err) {
        console.error(err);
        setError('Unable to generate drawing right now. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
    [prompt],
  );

  const handlePlaybackComplete = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return (
    <main>
      <section className="section-card">
        <h1>AI Whiteboard Tutor</h1>
        <p>
          Generate synchronized drawing instructions and spoken narration using Azure OpenAI. Submit a teaching prompt to
          watch the whiteboard come alive with explanations.
        </p>
        <form onSubmit={submitPrompt}>
          <label htmlFor="prompt">Prompt</label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the lesson you want the AI to teach..."
            required
          />
          <div className="status-line" style={{ marginTop: '1rem' }}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating…' : 'Generate Session'}
            </button>
            {error && <span style={{ color: '#f87171' }}>{error}</span>}
          </div>
        </form>
      </section>

      <section className="section-card">
        <h2>Whiteboard</h2>
        <WhiteboardCanvas commands={commands} isPlaying={isPlaying} onComplete={handlePlaybackComplete} />
      </section>

      <section className="section-card">
        <h2>Narration</h2>
        <div className="narration-log">
          {activeNarration.map((segment, index) => (
            <div key={`${segment.text}-${index}`} className="narration-entry">
              {segment.text}
            </div>
          ))}
          {!activeNarration.length && <p>Submit a prompt to hear the AI narration.</p>}
        </div>
      </section>
    </main>
  );
}
