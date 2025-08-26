import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemEntity } from '../items/item.schema';
import { CreateItemDto } from '../items/dto/create-item.dto';
import { UpdateItemDto } from '../items/dto/update-item.dto';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items via microservice' })
  @ApiResponse({ status: 200, type: [ItemEntity] })
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by id via microservice' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'Item ID',
  })
  @ApiResponse({ status: 200, type: ItemEntity })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new item via microservice' })
  @ApiResponse({ status: 201, type: ItemEntity })
  create(@Body() dto: CreateItemDto) {
    return this.clientService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item by id via microservice' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'Item ID',
  })
  @ApiResponse({ status: 200, type: ItemEntity })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateItemDto) {
    return this.clientService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete item by id via microservice' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'Item ID',
  })
  @ApiResponse({ status: 204 })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.delete(id);
  }
}
