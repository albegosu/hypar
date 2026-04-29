import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

export class ChatMessageDto {
  @IsIn(["user", "assistant", "system"])
  role: "user" | "assistant" | "system";

  @IsString()
  content: string;
}

export class ConverseDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  /**
   * Optional tenant/user identifier used to partition local chat memory.
   * Frontend can generate a stable id in localStorage.
   */
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  limit?: number;
}
