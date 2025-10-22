import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { GenerateDrawingDto } from './dto/generate-drawing.dto';
import { DrawingResponse } from './interfaces/drawing-response.interface';

@Injectable()
export class AzureRealtimeService {
  private readonly logger = new Logger(AzureRealtimeService.name);
  private readonly apiVersion = '2024-02-15-preview';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async generateDrawingSession(payload: GenerateDrawingDto): Promise<DrawingResponse> {
    const endpoint = this.configService.get<string>('AZURE_OPENAI_ENDPOINT');
    const apiKey = this.configService.get<string>('AZURE_OPENAI_API_KEY');
    const deployment = this.configService.get<string>('AZURE_OPENAI_DEPLOYMENT_NAME');

    if (!endpoint || !apiKey || !deployment) {
      throw new InternalServerErrorException(
        'Azure OpenAI configuration is missing. Please set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT_NAME.',
      );
    }

    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${this.apiVersion}`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            messages: [
              {
                role: 'system',
                content:
                  'You are a whiteboard teaching assistant that returns JSON with drawing commands and narration array. The drawing commands should follow the schema {"drawing":{"commands":[{"type":"stroke","points":[{"x":0,"y":0}],"color":"#000000","lineWidth":2,"delayMs":200}]},"narration":[{"text":"...","delayMs":500}]}',
              },
              {
                role: 'user',
                content: payload.prompt,
              },
            ],
            max_tokens: payload.maxTokens ?? 800,
            temperature: payload.temperature ?? 0.7,
            response_format: { type: 'json_object' },
          },
          {
            headers: {
              'api-key': apiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const { data } = response;
      const messageContent = data?.choices?.[0]?.message?.content;

      if (!messageContent) {
        throw new InternalServerErrorException('Azure OpenAI response did not include any content.');
      }

      const parsed = this.parseResponse(messageContent);
      return parsed;
    } catch (error) {
      this.logger.error('Failed to contact Azure OpenAI service', (error as Error)?.stack);

      if (error instanceof AxiosError) {
        this.logger.error(error.response?.data ?? error.message);
      }

      throw new InternalServerErrorException('Unable to generate drawing session from Azure OpenAI.');
    }
  }

  private parseResponse(content: string): DrawingResponse {
    try {
      const parsed: DrawingResponse = JSON.parse(content);
      if (!parsed.drawing || !parsed.narration) {
        throw new Error('Missing drawing or narration fields.');
      }
      return parsed;
    } catch (error) {
      this.logger.error('Failed to parse Azure response payload', (error as Error)?.stack);
      throw new InternalServerErrorException('Azure response was not valid JSON in the expected format.');
    }
  }
}
