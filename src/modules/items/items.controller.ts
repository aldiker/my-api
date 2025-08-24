import {
  BadRequestException,
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
import { Item } from './item.entity';
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

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiOkResponse({
    description: 'List of items',
    type: Array<Item>,
    isArray: true,
  })
  findAll(): Item[] {
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
  @ApiOkResponse({ description: 'The found item', type: Item })
  @ApiNotFoundResponse({ description: 'Item not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Item {
    return this.itemsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiCreatedResponse({ description: 'The created item', type: Item })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  create(@Body() dto: CreateItemDto): Item {
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
  @ApiOkResponse({ description: 'The updated item', type: Item })
  @ApiNotFoundResponse({ description: 'Item not found' })
  @ApiBadRequestResponse({
    description: 'Validation failed or nothing to update',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateItemDto,
  ): Item {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Nothing to update');
    }

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
  remove(@Param('id', new ParseUUIDPipe()) id: string): void {
    this.itemsService.remove(id);
  }
}
