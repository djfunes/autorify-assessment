import { Test, TestingModule } from '@nestjs/testing';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TradeInput } from './trade.input';
import { Survivor } from '../survivor/survivor.entity';
import { Item } from '../item/item.entity';
import { NotFoundException } from '@nestjs/common';

describe('TradeController', () => {
  let tradeController: TradeController;
  let tradeService: TradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeController],
      providers: [
        {
          provide: TradeService,
          useValue: {
            createTrade: jest.fn(),
            getTradeById: jest.fn(),
            getAllTrades: jest.fn(),
            getTradesBySurvivorId: jest.fn(),
          },
        },
      ],
    }).compile();

    tradeController = module.get<TradeController>(TradeController);
    tradeService = module.get<TradeService>(TradeService);
  });

  describe('createTrade', () => {
    it('should create a new trade', async () => {
      const tradeInput: TradeInput = {
        survivor1Id: 1,
        survivor2Id: 2,
        itemGivenId: 1,
        itemReceivedId: 2,
        quantityGiven: 1,
        quantityReceived: 1,
      };

      const expectedTrade = {
        id: 1,
        survivor1: { id: 1, name: 'Survivor 1' } as Survivor,
        survivor2: { id: 2, name: 'Survivor 2' } as Survivor,
        itemGiven: { id: 1, name: 'Item Given' } as Item,
        itemReceived: { id: 2, name: 'Item Received' } as Item,
        quantityGiven: 1,
        quantityReceived: 1,
        createdAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(tradeService, 'createTrade').mockResolvedValue(expectedTrade);

      const trade = await tradeController.createTrade(tradeInput);
      expect(trade).toEqual(expectedTrade);
      expect(tradeService.createTrade).toHaveBeenCalledWith(tradeInput);
    });
  });

  describe('getTradeById', () => {
    it('should return a trade by ID', async () => {
      const tradeId = 5;
      const expectedTrade = {
        id: tradeId,
        survivor1: { id: 1, name: 'Survivor 1' } as Survivor,
        survivor2: { id: 2, name: 'Survivor 2' } as Survivor,
        itemGiven: { id: 1, name: 'Item Given' } as Item,
        itemReceived: { id: 2, name: 'Item Received' } as Item,
        quantityGiven: 1,
        quantityReceived: 1,
        createdAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(tradeService, 'getTradeById').mockResolvedValue(expectedTrade);

      const trade = await tradeController.getTradeById(tradeId);
      expect(trade).toEqual(expectedTrade);
      expect(tradeService.getTradeById).toHaveBeenCalledWith(tradeId);
    });

    it('should throw NotFoundException if trade not found', async () => {
      const tradeId = 99;

      jest.spyOn(tradeService, 'getTradeById').mockRejectedValue(new NotFoundException());

      await expect(tradeController.getTradeById(tradeId)).rejects.toThrow(NotFoundException);
      expect(tradeService.getTradeById).toHaveBeenCalledWith(tradeId);
    });
  });

  describe('getAllTrades', () => {
    it('should return a list of trades', async () => {
      const expectedTrades = [
        {
          id: 1,
          survivor1: { id: 1, name: 'Survivor 1' } as Survivor,
          survivor2: { id: 2, name: 'Survivor 2' } as Survivor,
          itemGiven: { id: 1, name: 'Item Given' } as Item,
          itemReceived: { id: 2, name: 'Item Received' } as Item,
          quantityGiven: 1,
          quantityReceived: 1,
          createdAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          survivor1: { id: 3, name: 'Survivor 3' } as Survivor,
          survivor2: { id: 4, name: 'Survivor 4' } as Survivor,
          itemGiven: { id: 3, name: 'Another Item' } as Item,
          itemReceived: { id: 4, name: 'Received Item' } as Item,
          quantityGiven: 2,
          quantityReceived: 2,
          createdAt: new Date(),
          deletedAt: null,
        },
      ];

      jest.spyOn(tradeService, 'getAllTrades').mockResolvedValue(expectedTrades);

      const trades = await tradeController.getAllTrades();
      expect(trades).toEqual(expectedTrades);
      expect(tradeService.getAllTrades).toHaveBeenCalled();
    });
  });

  describe('getTradesBySurvivorId', () => {
    it('should return a list of trades by survivor ID', async () => {
      const survivorId = 3;
      const expectedTrades = [
        {
          id: 1,
          survivor1: { id: survivorId, name: 'Survivor 3' } as Survivor,
          survivor2: { id: 2, name: 'Survivor 2' } as Survivor,
          itemGiven: { id: 1, name: 'Item Given' } as Item,
          itemReceived: { id: 2, name: 'Item Received' } as Item,
          quantityGiven: 1,
          quantityReceived: 1,
          createdAt: new Date(),
          deletedAt: null,
        },
      ];

      jest.spyOn(tradeService, 'getTradesBySurvivorId').mockResolvedValue(expectedTrades);

      const trades = await tradeController.getTradesBySurvivorId(survivorId);
      expect(trades).toEqual(expectedTrades);
      expect(tradeService.getTradesBySurvivorId).toHaveBeenCalledWith(survivorId);
    });
  });
});
