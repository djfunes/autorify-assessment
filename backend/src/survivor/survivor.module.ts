import { Module } from '@nestjs/common';
import { SurvivorController } from './survivor.controller';
import { SurvivorService } from './survivor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survivor } from './survivor.entity';
import { Inventory } from '../inventory/inventory.entity';
import { InventoryService } from '../inventory/inventory.service';
import { Item } from '../item/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survivor, Inventory, Item])],
  controllers: [SurvivorController],
  providers: [SurvivorService, InventoryService]
})
export class SurvivorModule {}
