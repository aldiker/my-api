import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ example: 'Pencil', minLength: 1, maxLength: 50 })
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty({ example: 1.99, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}
