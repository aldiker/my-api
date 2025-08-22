import {
  BadRequestException,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(ItemsService.name);

  constructor() {
    if (this.items.length === 0) {
      for (let i = 0; i < 10; i++) {
        this.items.push(this.mockItem());
      }

      this.logger.log(`Initialized with ${this.items.length} mock items`);
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
    this.logger.log(`findAll: count=${this.items.length}`);

    return this.items;
  }

  findOne(id: string): Item {
    this.logger.log(`findOne: id=${id}`);

    const item = this.items.find((item) => item.id === id);
    if (!item) {
      this.logger.warn(`findOne: not found id=${id}`);
      throw new NotFoundException(`Item ${id} not found`);
    }

    return item;
  }

  create(dto: CreateItemDto) {
    this.logger.log(`create: name=${dto.name}, price=${dto.price}`);

    const item: Item = {
      id: randomUUID(),
      name: dto.name,
      price: dto.price,
    };
    this.items.push(item);

    return item;
  }

  update(id: string, dto: UpdateItemDto): Item {
    this.logger.log(`update: id=${id}, changes=${JSON.stringify(dto)}`);

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
    this.logger.log(`remove: id=${id}`);

    const item = this.findOne(id);

    this.items = this.items.filter((i) => i.id !== item.id);
  }
}
