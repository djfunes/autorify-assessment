import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { Survivor } from '../survivor/survivor.entity';
import { Item } from '../item/item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Survivor)
    private readonly survivorRepository: Repository<Survivor>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async addItemToInventory(
    survivorId: number,
    itemId: number,
    quantity: number,
  ) {
    const survivor = await this.survivorRepository.findOne({
      where: { id: survivorId },
    });
    if (!survivor) {
      throw new Error(`Survivor with ID ${survivorId} not found`);
    }

    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) {
      throw new Error(`Item with ID ${itemId} not found`);
    }

    const existingInventory = await this.inventoryRepository.findOne({
      where: { survivor, item },
    });

    if (existingInventory) {
      existingInventory.quantity += quantity;
      return this.inventoryRepository.save(existingInventory);
    } else {
      const newInventory = new Inventory();
      newInventory.survivor = survivor;
      newInventory.item = item;
      newInventory.quantity = quantity;
      return this.inventoryRepository.save(newInventory);
    }
  }

  async removeItemFromInventory(
    survivorId: number,
    itemId: number,
    quantity: number,
  ) {
    const survivor = await this.survivorRepository.findOne({
      where: { id: survivorId },
    });
    if (!survivor) {
      throw new Error(`Survivor with ID ${survivorId} not found`);
    }

    const item = await this.itemRepository.findOne({
      where: { id: itemId },
    });
    if (!item) {
      throw new Error(`Item with ID ${itemId} not found`);
    }

    const existingInventory = await this.inventoryRepository.findOne({
      where: { survivor, item },
    });

    if (existingInventory) {
      if (existingInventory.quantity >= quantity) {
        existingInventory.quantity -= quantity;
        return this.inventoryRepository.save(existingInventory);
      }
    } else {
      throw new Error(
        `Inventory for survivor ${survivorId} and item ${itemId} not found`,
      );
    }
  }

  async getInventoryBySurvivorId(survivorId: number): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { survivor: { id: survivorId }, deletedAt: null },
    });
  }

  async checkInventory(survivorId: number, itemId: number): Promise<number> {
    const survivor = await this.survivorRepository.findOne({
      where: { id: survivorId },
    });

    if (!survivor) {
      throw new NotFoundException(`Survivor with ID ${survivorId} not found`);
    }

    const inventoryItem = await this.inventoryRepository.findOne({
      where: { survivor, item: { id: itemId } },
    })
    if (!inventoryItem) {
      throw new NotFoundException(
        `Item with ID ${itemId} not found in inventory for survivor with ID ${survivorId}`,
      );
    }
    return inventoryItem ? inventoryItem.quantity : 0;
  }

}
