import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemEntity, ItemSchema } from './item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ItemEntity.name, schema: ItemSchema }]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
