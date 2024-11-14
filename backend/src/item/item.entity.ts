import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Trade } from '../trade/trade.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Trade, (trade) => trade.itemGiven)
  trades?: Trade[];

  @OneToMany(() => Inventory, (inventory) => inventory.item)
  inventory?: Inventory[];

  
  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}