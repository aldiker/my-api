import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { randomUUID } from 'crypto';
import { UpdateItemDto } from './dto/update-item.dto';
import { faker } from '@faker-js/faker';
import { InjectModel } from '@nestjs/mongoose';
import { ItemEntity } from './item.schema';
import { Model } from 'mongoose';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  private mockItem(): ItemEntity {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ min: 1, max: 200, dec: 2 })),
    };
  }

  constructor(
    @InjectModel(ItemEntity.name) private itemModel: Model<ItemEntity>,
  ) {
    // Initialization logic that requires async should be moved elsewhere
    this.logger.log('constructor: initializing items service');
    void this.initialize();
  }

  private async initialize() {
    const items = await this.findAll();
    if (!items.length) {
      this.logger.log('initialize: seeding database with mock data');
      await Promise.all(
        Array.from({ length: 10 }, () =>
          this.itemModel.create(this.mockItem()),
        ),
      );
      this.logger.log('initialize: seeding completed with 10 items');
    }
  }

  async findAll(): Promise<ItemEntity[]> {
    this.logger.debug('findAll: querying database');
    const items = await this.itemModel.find().lean().exec();
    this.logger.debug(`findAll: found ${items.length} items`);

    return items;
  }

  async findOne(id: string): Promise<ItemEntity> {
    this.logger.debug(`findOne: id="${id}"`);
    const item = await this.itemModel.findOne({ id }).lean().exec();
    if (!item) {
      this.logger.warn(`findOne: not found id=${id}`);
      throw new NotFoundException(`Item ${id} not found`);
    }
    this.logger.debug(`findOne: found item=${JSON.stringify(item)}`);

    return item;
  }

  async create(dto: CreateItemDto): Promise<ItemEntity> {
    this.logger.debug(`create: name="${dto.name}", price="${dto.price}"`);

    const newItem = new this.itemModel({
      id: randomUUID(),
      name: dto.name,
      price: dto.price,
    });

    return await newItem.save();
  }

  async update(id: string, dto: UpdateItemDto): Promise<ItemEntity> {
    this.logger.debug(`update: id="${id}", changes=${JSON.stringify(dto)}`);

    const cleanDto = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v != null),
    );

    // TODO: Validation !
    if (Object.keys(cleanDto).length === 0) {
      throw new BadRequestException('Nothing to update');
    }

    const updatedItem = await this.itemModel
      .findOneAndUpdate({ id }, { $set: cleanDto }, { new: true })
      .lean()
      .exec();

    if (!updatedItem) {
      throw new NotFoundException(`Item ${id} not found`);
    }

    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    this.logger.debug(`delete: id="${id}"`);

    const result = await this.itemModel.deleteOne({ id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Item ${id} not found`);
    }
  }
}
