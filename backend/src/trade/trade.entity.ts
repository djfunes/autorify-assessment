import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Survivor } from '../survivor/survivor.entity';
import { Item } from '../item/item.entity';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Survivor, (survivor) => survivor.id)
  survivor1: Survivor;

  @ManyToOne(() => Survivor, (survivor) => survivor.id)
  survivor2: Survivor;

  @ManyToOne(() => Item, (item) => item.trades)
  itemGiven: Item;

  @ManyToOne(() => Item, (item) => item.trades)
  itemReceived: Item;

  @Column()
  quantityGiven: number;

  @Column()
  quantityReceived: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
