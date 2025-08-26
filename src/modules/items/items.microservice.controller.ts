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
  async getItem(id: string): Promise<ItemEntity> {
    return this.itemsService.findOne(id);
  }

  @MessagePattern({ cmd: ItemMessagePattern.CREATE })
  async create(dto: CreateItemDto): Promise<ItemEntity> {
    return this.itemsService.create(dto);
  }

  @MessagePattern({ cmd: ItemMessagePattern.UPDATE })
  async update(id: string, dto: UpdateItemDto): Promise<ItemEntity> {
    return this.itemsService.update(id, dto);
  }

  @MessagePattern({ cmd: ItemMessagePattern.DELETE })
  async delete(id: string): Promise<void> {
    return this.itemsService.delete(id);
  }
}
