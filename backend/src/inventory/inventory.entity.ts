import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Survivor } from '../survivor/survivor.entity';
import { Item } from '../item/item.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Survivor, (survivor) => survivor.inventory)
  @JoinColumn({ name: 'survivorId' })
  survivor: Survivor;

  @Column()
  survivorId: number;

  @ManyToOne(() => Item, (item) => item.inventory)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  itemId: number;
}
