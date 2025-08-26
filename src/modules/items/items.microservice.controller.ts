import { Controller } from '@nestjs/common';
import { ItemsService } from './items.service';
import { MessagePattern } from '@nestjs/microservices';
import { ItemEntity } from './item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemMessagePattern } from 'src/common/constants/message-patterns';

@Controller()
export class ItemsMicroserviceController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern({ cmd: ItemMessagePattern.FIND_ALL })
  async getItems(): Promise<ItemEntity[]> {
    return this.itemsService.findAll();
  }

  @MessagePattern({ cmd: ItemMessagePattern.FIND_ONE })
  async getItem({ id }: { id: string }): Promise<ItemEntity> {
    console.log('getItem. id: ', id);
    if (!id) {
      throw new Error(`Microservice - getItem. Invalid id: ${id}`);
    }
    return this.itemsService.findOne(id);
  }

  @MessagePattern({ cmd: ItemMessagePattern.CREATE })
  async create({ dto }: { dto: CreateItemDto }): Promise<ItemEntity> {
    console.log('create. dto: ', dto);
    if (!dto) {
      throw new Error(
        `Microservice - create. Invalid create payload: ${JSON.stringify({ dto })}`,
      );
    }
    return this.itemsService.create(dto);
  }

  @MessagePattern({ cmd: ItemMessagePattern.UPDATE })
  async update({
    id,
    dto,
  }: {
    id: string;
    dto: UpdateItemDto;
  }): Promise<ItemEntity> {
    if (!id || !dto) {
      throw new Error(
        `Microservice - update. Invalid update payload: ${JSON.stringify({ id, dto })}`,
      );
    }
    return this.itemsService.update(id, dto);
  }

  @MessagePattern({ cmd: ItemMessagePattern.DELETE })
  async delete({ id }: { id: string }): Promise<{ success: boolean }> {
    if (!id) {
      throw new Error(`Microservice - delete. Invalid id: ${id}`);
    }
    await this.itemsService.delete(id);
    return { success: true };
  }
}
