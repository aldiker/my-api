import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemEntity, ItemSchema } from './item.schema';
import { ItemsMicroserviceController } from './items.microservice.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ItemEntity.name, schema: ItemSchema }]),
  ],
  controllers: [ItemsController, ItemsMicroserviceController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
