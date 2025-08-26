import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ItemMessagePattern } from 'src/common/constants/message-patterns';
import { ItemEntity } from '../items/item.schema';
import { CreateItemDto } from '../items/dto/create-item.dto';
import { UpdateItemDto } from '../items/dto/update-item.dto';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    @Inject('ITEM_SERVICE') private readonly itemClient: ClientProxy,
  ) {}

  async findAll(): Promise<ItemEntity[]> {
    this.logger.log('Getting all items via microservice');
    return firstValueFrom(
      this.itemClient.send<ItemEntity[]>(
        { cmd: ItemMessagePattern.FIND_ALL },
        {},
      ),
    );
  }

  async findOne(id: string): Promise<ItemEntity> {
    this.logger.log(`Getting item ${id} via microservice`);
    return firstValueFrom(
      this.itemClient.send<ItemEntity>(
        { cmd: ItemMessagePattern.FIND_ONE },
        { id },
      ),
    );
  }

  async create(dto: CreateItemDto): Promise<ItemEntity> {
    this.logger.log(`Creating item via microservice: ${JSON.stringify(dto)}`);
    return firstValueFrom(
      this.itemClient.send<ItemEntity>(
        { cmd: ItemMessagePattern.CREATE },
        { dto },
      ),
    );
  }

  async update(id: string, dto: Partial<UpdateItemDto>): Promise<ItemEntity> {
    this.logger.log(
      `Updating item ${id} via microservice: ${JSON.stringify(dto)}`,
    );
    return firstValueFrom(
      this.itemClient.send<ItemEntity>(
        { cmd: ItemMessagePattern.UPDATE },
        { id, dto },
      ),
    );
  }

  async delete(id: string): Promise<{ success: boolean }> {
    this.logger.log(`Removing item ${id} via microservice`);
    return firstValueFrom(
      this.itemClient.send<{ success: boolean }>(
        { cmd: ItemMessagePattern.DELETE },
        { id },
      ),
    );
  }
}
