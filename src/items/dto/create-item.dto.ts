import { Type } from 'class-transformer';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}
