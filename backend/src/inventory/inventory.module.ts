import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { Item } from '../item/item.entity';
import { Survivor } from '../survivor/survivor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Item, Survivor])],
  controllers: [],
  providers: [InventoryService],
})
export class InventoryModule {}
