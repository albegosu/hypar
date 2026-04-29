import { IsString, IsOptional, IsIn } from "class-validator";

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsIn(["text", "markdown"])
  sourceType: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
