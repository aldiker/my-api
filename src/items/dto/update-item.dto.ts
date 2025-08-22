import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;
}
