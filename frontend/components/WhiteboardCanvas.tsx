'use client';

import { useEffect, useRef, useState } from 'react';
import type { DrawingCommand } from '../types/drawing';

export interface WhiteboardCanvasProps {
  commands: DrawingCommand[];
  isPlaying: boolean;
  onComplete?: () => void;
}

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 480;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function WhiteboardCanvas({ commands, isPlaying, onComplete }: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!isPlaying || !commands.length || isRendering) {
      return;
    }

    let cancelled = false;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const run = async () => {
      setIsRendering(true);
      for (const command of commands) {
        if (cancelled) break;
        const delay = command.delayMs ?? 300;
        if (delay > 0) {
          await sleep(delay);
        }

        switch (command.type) {
          case 'clear': {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            break;
          }
          case 'erase':
          case 'stroke': {
            const points = command.points ?? [];
            if (!points.length) break;

            ctx.save();
            ctx.strokeStyle = command.color ?? '#111827';
            ctx.lineWidth = command.lineWidth ?? (command.type === 'erase' ? 16 : 4);
            if (command.type === 'erase') {
              ctx.globalCompositeOperation = 'destination-out';
            } else {
              ctx.globalCompositeOperation = 'source-over';
            }

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i += 1) {
              const point = points[i];
              ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
            ctx.restore();
            break;
          }
          default:
            break;
        }
      }

      setIsRendering(false);
      if (!cancelled) {
        onComplete?.();
      }
    };

    run();

    return () => {
      cancelled = true;
      setIsRendering(false);
    };
  }, [commands, isPlaying, isRendering, onComplete]);

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="whiteboard-canvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </div>
  );
}
