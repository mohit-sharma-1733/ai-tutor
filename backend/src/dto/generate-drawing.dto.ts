import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class GenerateDrawingDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  maxTokens?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;
}
