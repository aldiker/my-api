import { ApiProperty } from '@nestjs/swagger';

export class Item {
  @ApiProperty({
    format: 'uuid',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @ApiProperty({ example: 'Item Name' })
  name: string;

  @ApiProperty({ example: 9.99, minimum: 0 })
  price: number;
}
