import { Controller } from '@nestjs/common';
import { ItemsService } from './items.service';
import { MessagePattern } from '@nestjs/microservices';
import { ItemEntity } from './item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller()
export class ItemsMicroserviceController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern({ cmd: 'get_items' })
  async getItems(): Promise<ItemEntity[]> {
    return this.itemsService.findAll();
  }

  @MessagePattern({ cmd: 'get_item' })
  async getItem(id: string): Promise<ItemEntity> {
    return this.itemsService.findOne(id);
  }

  @MessagePattern({ cmd: 'create_item' })
  async create(dto: CreateItemDto): Promise<ItemEntity> {
    return this.itemsService.create(dto);
  }

  @MessagePattern({ cmd: 'update_item' })
  async update(id: string, dto: UpdateItemDto): Promise<ItemEntity> {
    return this.itemsService.update(id, dto);
  }

  @MessagePattern({ cmd: 'delete_item' })
  async delete(id: string): Promise<void> {
    return this.itemsService.remove(id);
  }
}
