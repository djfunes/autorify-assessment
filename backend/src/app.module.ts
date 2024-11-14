import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { SurvivorModule } from './survivor/survivor.module';
import { ItemModule } from './item/item.module';
import { TradeModule } from './trade/trade.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    DbModule,
    SurvivorModule,
    ItemModule,
    TradeModule,
    ReportModule,
    AuthModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
