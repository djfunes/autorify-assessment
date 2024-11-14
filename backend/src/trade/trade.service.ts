import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from './trade.entity';
import { InventoryService } from '../inventory/inventory.service';
import { Survivor } from '../survivor/survivor.entity';
import { Item } from '../item/item.entity';
import { TradeInput } from './trade.input';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>,
    @InjectRepository(Survivor)
    private readonly survivorRepository: Repository<Survivor>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly inventoryService: InventoryService,
  ) {}

  async createTrade({
    survivor1Id,
    survivor2Id,
    itemGivenId,
    itemReceivedId,
    quantityGiven,
    quantityReceived,
  }: TradeInput) {
    // Fetch survivors
    const [survivor1, survivor2] = await Promise.all([
      this.survivorRepository.findOne({ where: { id: survivor1Id } }),
      this.survivorRepository.findOne({ where: { id: survivor2Id } }),
    ]);
    if (!survivor1 || !survivor2) {
      throw new NotFoundException('One or both survivors not found');
    }

    // Fetch items
    const itemGiven = await this.itemRepository.findOne({
      where: { id: itemGivenId },
    });

    const itemReceived = await this.itemRepository.findOne({
      where: { id: itemReceivedId },
    });

    if (!itemGiven || !itemReceived) {
      throw new NotFoundException('One or both items not found');
    }

    // Check inventory for both survivors
    const survivor1Inventory = await this.inventoryService.checkInventory(
      survivor1Id,
      itemGivenId,
    );
    const survivor2Inventory = await this.inventoryService.checkInventory(
      survivor2Id,
      itemReceivedId,
    );

    if (survivor1Inventory < quantityGiven) {
      throw new BadRequestException(
        `Survivor ${survivor1Id} does not have enough of item ${itemGivenId}`,
      );
    }
    if (survivor2Inventory < quantityReceived) {
      throw new BadRequestException(
        `Survivor ${survivor2Id} does not have enough of item ${itemReceivedId}`,
      );
    }

    // Update inventory: survivor1 loses quantityGiven of itemGiven, survivor2 gains it, and vice versa
    await Promise.all([
      this.inventoryService.removeItemFromInventory(
        survivor1Id,
        itemGivenId,
        quantityGiven,
      ),
      this.inventoryService.addItemToInventory(
        survivor2Id,
        itemGivenId,
        quantityGiven,
      ),
      this.inventoryService.removeItemFromInventory(
        survivor2Id,
        itemReceivedId,
        quantityReceived,
      ),
      this.inventoryService.addItemToInventory(
        survivor1Id,
        itemReceivedId,
        quantityReceived,
      ),
    ]);

    // Proceed with trade creation
    const trade = this.tradeRepository.create({
      survivor1,
      survivor2,
      itemGiven,
      itemReceived,
      quantityGiven,
      quantityReceived,
      createdAt: new Date(),
    });
    await this.tradeRepository.save(trade);

    return trade;
  }
  async deleteTrade(id: number) {
    const existingTrade = await this.tradeRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!existingTrade) {
      throw new Error(`Trade with ID ${id} not found`);
    }
    const trade = existingTrade;
    trade.deletedAt = new Date();
    return this.tradeRepository.save(trade);
  }

  async getAllTrades() {
    return this.tradeRepository.find({
      where: { deletedAt: null },
    });
  }

  async getTradeById(id: number) {
    return this.tradeRepository.findOne({
      where: { id, deletedAt: null },
    });
  }

  async getTradesBySurvivorId(survivorId: number) {
    // Separate query for trades where the survivor is the giver (survivor1)
    const giverTrades = await this.tradeRepository
      .createQueryBuilder('trade')
      .leftJoinAndSelect('trade.survivor1', 'survivor1')
      .leftJoinAndSelect('trade.survivor2', 'survivor2')
      .leftJoinAndSelect('trade.itemGiven', 'itemGiven')
      .leftJoinAndSelect('trade.itemReceived', 'itemReceived')
      .where('trade.survivor1.id = :id', { id: survivorId })
      .select([
        'trade.id as id',
        'trade.createdAt as createdAt',
        'survivor1.id as survivor1Id', // Giver
        'survivor2.id as survivor2Id', // Receiver
        'itemGiven.id as itemGivenId',
        'itemGiven.name as itemGivenName',
        'itemReceived.id as itemReceivedId',
        'itemReceived.name as itemReceivedName',
        'trade.quantityGiven as quantityGiven',
        'trade.quantityReceived as quantityReceived',
      ])
      .getRawMany();

    // Separate query for trades where the survivor is the receiver (survivor2)
    const receiverTrades = await this.tradeRepository
      .createQueryBuilder('trade')
      .leftJoinAndSelect('trade.survivor1', 'survivor1')
      .leftJoinAndSelect('trade.survivor2', 'survivor2')
      .leftJoinAndSelect('trade.itemGiven', 'itemGiven')
      .leftJoinAndSelect('trade.itemReceived', 'itemReceived')
      .where('trade.survivor2.id = :id', { id: survivorId })
      .select([
        'trade.id as id',
        'trade.createdAt as createdAt',
        'survivor1.id as survivor1Id', // Giver
        'survivor2.id as survivor2Id', // Receiver
        'itemGiven.id as itemGivenId',
        'itemGiven.name as itemGivenName',
        'itemReceived.id as itemReceivedId',
        'itemReceived.name as itemReceivedName',
        'trade.quantityGiven as quantityGiven',
        'trade.quantityReceived as quantityReceived',
      ])
      .getRawMany();

    // Combine the results of both queries
    const combinedTrades = [
      ...giverTrades.map((trade) => ({
        ...trade,
        action: 'Give', // Current survivor was the giver
      })),
      ...receiverTrades.map((trade) => ({
        ...trade,
        action: 'Receive', // Current survivor was the receiver
      })),
    ];

    return combinedTrades;
  }
}
