export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingCommand {
  type: 'stroke' | 'erase' | 'clear';
  points?: DrawingPoint[];
  color?: string;
  lineWidth?: number;
  delayMs?: number;
}

export interface NarrationSegment {
  text: string;
  delayMs?: number;
}

export interface DrawingResponse {
  drawing: {
    commands: DrawingCommand[];
  };
  narration: NarrationSegment[];
}
