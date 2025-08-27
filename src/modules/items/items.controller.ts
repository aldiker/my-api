import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ItemEntity } from './item.schema';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiOkResponse({
    description: 'List of items',
    type: Array<ItemEntity>,
    isArray: true,
  })
  findAll(): Promise<ItemEntity[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiParam({
    name: 'id',
    description: 'Item ID (UUID)',
    type: 'string',
    format: 'uuid',
  })
  @ApiOkResponse({ description: 'The found item', type: ItemEntity })
  @ApiNotFoundResponse({ description: 'Item not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ItemEntity> {
    return this.itemsService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new item' })
  @ApiCreatedResponse({ description: 'The created item', type: ItemEntity })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateItemDto): Promise<ItemEntity> {
    return this.itemsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiParam({
    name: 'id',
    description: 'Item ID (UUID)',
    type: 'string',
    format: 'uuid',
  })
  @ApiOkResponse({ description: 'The updated item', type: ItemEntity })
  @ApiNotFoundResponse({ description: 'Item not found' })
  @ApiBadRequestResponse({
    description: 'Validation failed or nothing to update',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateItemDto,
  ): Promise<ItemEntity> {
    return this.itemsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an item' })
  @ApiParam({
    name: 'id',
    description: 'Item ID (UUID)',
    type: 'string',
    format: 'uuid',
  })
  @ApiOkResponse({ description: 'Item deleted successfully' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.itemsService.delete(id);
  }
}
