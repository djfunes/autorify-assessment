import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from './item.entity';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  createItem(@Body() item: Item) {
    return this.itemService.createItem(item);
  }

  @Put(':id')
  updateItem(@Param('id') id: number, @Body() item: Item) {
    return this.itemService.updateItem(id, item);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: number) {
    return this.itemService.deleteItem(id);
  }

  @Get()
  getAllItems() {
    return this.itemService.getAllItems();
  }

  @Get(':id')
  getItemById(@Param('id') id: number) {
    return this.itemService.getItemById(id);
  }
}
