import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from '../trade/trade.entity';
import { Item } from '../item/item.entity';
import { Survivor } from '../survivor/survivor.entity';
import { Inventory } from '../inventory/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survivor, Item, Trade, Inventory])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
