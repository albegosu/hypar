import { IsString, IsOptional, IsNumber, Min, Max } from "class-validator";

export class SearchDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  limit?: number;
}
