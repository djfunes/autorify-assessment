import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Trade } from '../trade/trade.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity()
export class Survivor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  infected: boolean;

  @Column('decimal', { precision: 10, scale: 8 })
  lastLocationLat?: number;

  @Column('decimal', { precision: 11, scale: 8 })
  lastLocationLong?: number;

  
  @OneToMany(() => Inventory, (inventory) => inventory.survivor)
  inventory?: Inventory[];
  
  @OneToMany(() => Trade, (trade) => trade.survivor1)
  trades?: Trade[];
  
  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}