export interface Point {
  x: number;
  y: number;
}

export type CommandType = 'stroke' | 'erase' | 'clear';

export interface DrawingCommand {
  type: CommandType;
  points?: Point[];
  color?: string;
  lineWidth?: number;
  delayMs?: number;
}

export interface NarrationSegment {
  text: string;
  delayMs?: number;
}

export interface DrawingSessionResponse {
  drawing: {
    commands: DrawingCommand[];
  };
  narration: NarrationSegment[];
}
