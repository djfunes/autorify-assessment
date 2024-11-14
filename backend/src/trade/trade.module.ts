import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { Trade } from './trade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../item/item.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Survivor } from '../survivor/survivor.entity';
import { InventoryService } from '../inventory/inventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trade, Item, Inventory, Survivor])],
  controllers: [TradeController],
  providers: [TradeService, InventoryService]
})
export class TradeModule {}
