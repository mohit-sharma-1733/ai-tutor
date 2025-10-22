import { Body, Controller, Post } from '@nestjs/common';
import { AzureRealtimeService } from './azure-realtime.service';
import { GenerateDrawingDto } from './dto/generate-drawing.dto';
import { DrawingResponse } from './interfaces/drawing-response.interface';

@Controller('drawing')
export class DrawingController {
  constructor(private readonly azureRealtimeService: AzureRealtimeService) {}

  @Post('session')
  async generateDrawing(@Body() payload: GenerateDrawingDto): Promise<DrawingResponse> {
    return this.azureRealtimeService.generateDrawingSession(payload);
  }
}
