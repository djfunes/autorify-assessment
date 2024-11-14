import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../item/item.entity';
import { Survivor } from '../survivor/survivor.entity';
import { Trade } from '../trade/trade.entity';

const entities = [Item, Trade, Survivor];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: process.env.NODE_ENV !== 'production' ? '.env' : undefined,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: entities,
      synchronize: true,
      autoLoadEntities: true,
      retryAttempts: 5, // Number of retries
      retryDelay: 3000, // Delay between retries in milliseconds
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
