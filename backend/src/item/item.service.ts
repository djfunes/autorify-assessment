import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async createItem(item: Item) {
    return this.itemRepository.save(item);
  }

  async updateItem(id: number, item: Item) {
    const existingItem = await this.itemRepository.findOneOrFail({
      where: { id, deletedAt: null },
    });
  
    if (!existingItem) {
      throw new Error(`Item with ID ${id} not found`);
    }
    const updatedItem = this.itemRepository.merge(existingItem, item);

    return this.itemRepository.save(updatedItem);
  }
  

  async deleteItem(id: number) {
    const existingItem = await this.itemRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!existingItem) {
      throw new Error(`Item with ID ${id} not found`);
    } else {
      const item = existingItem;
      item.deletedAt = new Date();
      return this.itemRepository.save(item);
    }
  }

  async getAllItems() {
    return this.itemRepository.find({ where: { deletedAt: null } });
  }

  async getItemById(id: number) {
    return this.itemRepository
      .findOne({
        where: { id, deletedAt: null },
      })
  }
}
