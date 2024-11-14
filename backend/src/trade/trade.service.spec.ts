import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { Repository } from 'typeorm';
import { Trade } from './trade.entity';
import { InventoryService } from '../inventory/inventory.service';
import { Survivor } from '../survivor/survivor.entity';
import { Item } from '../item/item.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TradeInput } from './trade.input';

describe('TradeService', () => {
  let service: TradeService;
  let tradeRepository: Repository<Trade>;
  let survivorRepository: Repository<Survivor>;
  let itemRepository: Repository<Item>;
  let inventoryService: InventoryService;

  const mockTradeRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
  };

  const mockSurvivorRepository = {
    findOne: jest.fn(),
  };

  const mockItemRepository = {
    findOne: jest.fn(),
  };

  const mockInventoryService = {
    checkInventory: jest.fn(),
    addItemToInventory: jest.fn(),
    removeItemFromInventory: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeService,
        { provide: getRepositoryToken(Trade), useValue: mockTradeRepository },
        {
          provide: getRepositoryToken(Survivor),
          useValue: mockSurvivorRepository,
        },
        { provide: getRepositoryToken(Item), useValue: mockItemRepository },
        { provide: InventoryService, useValue: mockInventoryService },
      ],
    }).compile();

    service = module.get<TradeService>(TradeService);
    tradeRepository = module.get<Repository<Trade>>(getRepositoryToken(Trade));
    survivorRepository = module.get<Repository<Survivor>>(
      getRepositoryToken(Survivor),
    );
    itemRepository = module.get<Repository<Item>>(getRepositoryToken(Item));
    inventoryService = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTrade', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    })
    it('should create a trade successfully', async () => {
      const survivor1 = { id: 1, name: 'Survivor1' };
      const survivor2 = { id: 2, name: 'Survivor2' };
      const itemGiven = { id: 1, name: 'Water' };
      const itemReceived = { id: 2, name: 'Food' };
      const tradeInput = {
        survivor1Id: 1,
        survivor2Id: 2,
        itemGivenId: 1,
        itemReceivedId: 2,
        quantityGiven: 5,
        quantityReceived: 3,
      };

      mockSurvivorRepository.findOne
        .mockResolvedValueOnce(survivor1)
        .mockResolvedValueOnce(survivor2);
      mockItemRepository.findOne
        .mockResolvedValueOnce(itemGiven)
        .mockResolvedValueOnce(itemReceived);
      mockInventoryService.checkInventory
        .mockResolvedValueOnce(10) // Sufficient inventory for survivor1
        .mockResolvedValueOnce(5); // Sufficient inventory for survivor2
      mockInventoryService.removeItemFromInventory.mockResolvedValue(undefined);
      mockInventoryService.addItemToInventory.mockResolvedValue(undefined);
      mockTradeRepository.create.mockReturnValue({ ...tradeInput });
      mockTradeRepository.save.mockResolvedValue({ ...tradeInput });

      const trade = await service.createTrade(tradeInput);

      expect(trade).toEqual(expect.objectContaining(tradeInput));
      expect(
        mockInventoryService.removeItemFromInventory,
      ).toHaveBeenCalledTimes(2);
      expect(mockInventoryService.addItemToInventory).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if one or both survivors are not found', async () => {
      mockSurvivorRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.createTrade({
          survivor1Id: 1,
          survivor2Id: 2,
          itemGivenId: 1,
          itemReceivedId: 2,
          quantityGiven: 5,
          quantityReceived: 3,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if one or both items are not found', async () => {
      mockSurvivorRepository.findOne.mockResolvedValueOnce({ id: 1 });
      mockItemRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.createTrade({
          survivor1Id: 1,
          survivor2Id: 2,
          itemGivenId: 1,
          itemReceivedId: 2,
          quantityGiven: 5,
          quantityReceived: 3,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if survivor1 does not have enough of itemGiven', async () => {
      const tradeInput = {
        survivor1Id: 1,
        survivor2Id: 2,
        itemGivenId: 1,
        itemReceivedId: 2,
        quantityGiven: 5,
        quantityReceived: 3,
      };
  
      // Mock survivors
      mockSurvivorRepository.findOne
        .mockResolvedValueOnce({ id: 1, name: 'Survivor 1' })
        .mockResolvedValueOnce({ id: 2, name: 'Survivor 2' });
  
      // Mock items
      mockItemRepository.findOne
        .mockResolvedValueOnce({ id: 1, name: 'Item Given' })
        .mockResolvedValueOnce({ id: 2, name: 'Item Received' });
  
      // Mock inventory check
      mockInventoryService.checkInventory
        .mockResolvedValueOnce(2) // Insufficient items for survivor1
        .mockResolvedValueOnce(5); // Sufficient items for survivor2
  
      await expect(service.createTrade(tradeInput)).rejects.toThrowError(
        new BadRequestException('Survivor 1 does not have enough of item 1')
      );
  
      // Additional check to ensure mocks were called with expected values
      expect(mockSurvivorRepository.findOne).toHaveBeenNthCalledWith(1, { where: { id: tradeInput.survivor1Id } });
      expect(mockSurvivorRepository.findOne).toHaveBeenNthCalledWith(2, { where: { id: tradeInput.survivor2Id } });
      expect(mockItemRepository.findOne).toHaveBeenNthCalledWith(1, { where: { id: tradeInput.itemGivenId } });
      expect(mockItemRepository.findOne).toHaveBeenNthCalledWith(2, { where: { id: tradeInput.itemReceivedId } });
    });

    it('should throw BadRequestException if survivor2 does not have enough of itemReceived', async () => {
      const tradeInput = {
        survivor1Id: 1,
        survivor2Id: 2,
        itemGivenId: 1,
        itemReceivedId: 2,
        quantityGiven: 5,
        quantityReceived: 3,
      };
    
      // Mock survivors
      mockSurvivorRepository.findOne
        .mockResolvedValueOnce({ id: 1, name: 'Survivor 1' })
        .mockResolvedValueOnce({ id: 2, name: 'Survivor 2' });
    
      // Mock items
      mockItemRepository.findOne
        .mockResolvedValueOnce({ id: 1, name: 'Item Given' })
        .mockResolvedValueOnce({ id: 2, name: 'Item Received' });
    
      // Mock inventory check
      mockInventoryService.checkInventory
        .mockResolvedValueOnce(10) // Sufficient items for survivor1
        .mockResolvedValueOnce(2); // Insufficient items for survivor2
    
      await expect(service.createTrade(tradeInput)).rejects.toThrowError(
        new BadRequestException('Survivor 2 does not have enough of item 2')
      );
    
      // Additional check to ensure mocks were called with expected values
      expect(mockSurvivorRepository.findOne).toHaveBeenNthCalledWith(1, { where: { id: tradeInput.survivor1Id } });
      expect(mockSurvivorRepository.findOne).toHaveBeenNthCalledWith(2, { where: { id: tradeInput.survivor2Id } });
      expect(mockItemRepository.findOne).toHaveBeenNthCalledWith(1, { where: { id: tradeInput.itemGivenId } });
      expect(mockItemRepository.findOne).toHaveBeenNthCalledWith(2, { where: { id: tradeInput.itemReceivedId } });
    });
    
    
  });

  describe('deleteTrade', () => {
    it('should delete a trade successfully', async () => {
      const trade = { id: 1, deletedAt: null };

      // Mock the findOne method to return the trade by ID
      mockTradeRepository.findOne.mockResolvedValueOnce(trade);

      // Mock the save method to simulate marking the trade as deleted
      mockTradeRepository.save.mockResolvedValueOnce({
        ...trade,
        deletedAt: new Date(),
      });

      const result = await service.deleteTrade(1);

      expect(result.deletedAt).toBeDefined();
      expect(mockTradeRepository.save).toHaveBeenCalledWith({
        ...trade,
        deletedAt: expect.any(Date),
      });
    });

    it('should throw error if trade not found', async () => {
      mockTradeRepository.find.mockResolvedValueOnce([]);

      await expect(service.deleteTrade(1)).rejects.toThrowError(
        'Trade with ID 1 not found',
      );
    });
  });
});
