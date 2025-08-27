import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'items' })
export class ItemEntity {
  @ApiProperty({
    format: 'uuid',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @ApiProperty({ example: 'Item Name' })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({ example: 9.99, minimum: 0 })
  @Prop({ type: Number, required: true, min: 0 })
  price: number;
}

export type ItemDocument = HydratedDocument<ItemEntity>;

export const ItemSchema = SchemaFactory.createForClass(ItemEntity);
ItemSchema.set('timestamps', true);

// We don't use toJSON transformation if we use lean function in services
// ItemSchema.set('toJSON', {
//   versionKey: false, // removes the __v field
//   transform: (_doc, ret: Record<string, any>) => {
//     delete ret._id; // Remove the _id field (MongoDB adds it automatically)
//     return ret;
//   },
// });

ItemSchema.index({ id: 1 }, { unique: true });
