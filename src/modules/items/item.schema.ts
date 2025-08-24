import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'items' })
export class ItemEntity {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;
}

export type ItemDocument = HydratedDocument<ItemEntity>;

export const ItemSchema = SchemaFactory.createForClass(ItemEntity);

ItemSchema.set('toJSON', {
  versionKey: false, // removes the __v field
  transform: (_doc, ret: Record<string, any>) => {
    delete ret._id; // Remove the _id field (MongoDB adds it automatically)
    return ret;
  },
});
