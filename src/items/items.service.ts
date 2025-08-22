import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { randomUUID } from 'crypto';
import { UpdateItemDto } from './dto/update-item.dto';
import { faker } from '@faker-js/faker';

@Injectable()
export class ItemsService {
  private items: Item[] = [];
  constructor() {
    if (this.items.length === 0) {
      for (let i = 0; i < 10; i++) {
        this.items.push(this.mockItem());
      }
    }
  }

  private mockItem(): Item {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ min: 1, max: 200, dec: 2 })),
    };
  }

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: string): Item {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return item;
  }

  create(dto: CreateItemDto) {
    const item: Item = {
      id: randomUUID(),
      name: dto.name,
      price: dto.price,
    };
    this.items.push(item);
    return item;
  }

  update(id: string, dto: UpdateItemDto): Item {
    const item = this.findOne(id);
    const cleanDto = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v != null),
    );

    if (Object.keys(cleanDto).length === 0) {
      throw new BadRequestException('Nothing to update');
    }

    return { ...item, ...cleanDto };
  }

  remove(id: string): void {
    const item = this.findOne(id);
    this.items = this.items.filter((i) => i.id !== item.id);
  }
}
