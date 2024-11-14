import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { Survivor } from '../survivor/survivor.entity';
import { Item } from '../item/item.entity';
import { NotFoundException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;
  let inventoryRepository: Repository<Inventory>;
  let survivorRepository: Repository<Survivor>;
  let itemRepository: Repository<Item>;

  const mockInventoryRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };
  const mockSurvivorRepository = {
    findOne: jest.fn(),
  };
  const mockItemRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: getRepositoryToken(Survivor),
          useValue: mockSurvivorRepository,
        },
        { provide: getRepositoryToken(Item), useValue: mockItemRepository },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    inventoryRepository = module.get<Repository<Inventory>>(
      getRepositoryToken(Inventory),
    );
    survivorRepository = module.get<Repository<Survivor>>(
      getRepositoryToken(Survivor),
    );
    itemRepository = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addItemToInventory', () => {
    it('should add a new item to the inventory', async () => {
      const survivorId = 1;
      const itemId = 1;
      const quantity = 5;
      const survivor = { id: survivorId } as Survivor;
      const item = { id: itemId } as Item;

      mockSurvivorRepository.findOne.mockResolvedValue(survivor);
      mockItemRepository.findOne.mockResolvedValue(item);
      mockInventoryRepository.findOne.mockResolvedValue(null);
      mockInventoryRepository.save.mockResolvedValue({
        survivor,
        item,
        quantity,
      });

      const result = await service.addItemToInventory(
        survivorId,
        itemId,
        quantity,
      );
      expect(mockSurvivorRepository.findOne).toHaveBeenCalledWith({
        where: { id: survivorId },
      });
      expect(mockItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: itemId },
      });
      expect(mockInventoryRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ survivor, item, quantity });
    });

    it('should increase quantity if item already exists in inventory', async () => {
      const survivorId = 1;
      const itemId = 1;
      const quantity = 5;
      const existingInventory = {
        survivor: { id: survivorId },
        item: { id: itemId },
        quantity: 10,
      } as Inventory;

      mockSurvivorRepository.findOne.mockResolvedValue(
        existingInventory.survivor,
      );
      mockItemRepository.findOne.mockResolvedValue(existingInventory.item);
      mockInventoryRepository.findOne.mockResolvedValue(existingInventory);

      await service.addItemToInventory(survivorId, itemId, quantity);
      expect(mockInventoryRepository.save).toHaveBeenCalledWith({
        ...existingInventory,
        quantity: 15,
      });
    });

    it('should throw an error if survivor is not found', async () => {
      mockSurvivorRepository.findOne.mockResolvedValue(null);
      await expect(service.addItemToInventory(1, 1, 5)).rejects.toThrow(
        'Survivor with ID 1 not found',
      );
    });

    it('should throw an error if item is not found', async () => {
      mockSurvivorRepository.findOne.mockResolvedValue({ id: 1 });
      mockItemRepository.findOne.mockResolvedValue(null);
      await expect(service.addItemToInventory(1, 1, 5)).rejects.toThrow(
        'Item with ID 1 not found',
      );
    });
  });

  describe('removeItemFromInventory', () => {
    it('should decrease quantity if sufficient quantity exists', async () => {
      const survivorId = 1;
      const itemId = 1;
      const quantity = 3;
      const existingInventory = {
        survivor: { id: survivorId },
        item: { id: itemId },
        quantity: 5,
      } as Inventory;

      mockSurvivorRepository.findOne.mockResolvedValue(
        existingInventory.survivor,
      );
      mockItemRepository.findOne.mockResolvedValue(existingInventory.item);
      mockInventoryRepository.findOne.mockResolvedValue(existingInventory);

      await service.removeItemFromInventory(survivorId, itemId, quantity);
      expect(mockInventoryRepository.save).toHaveBeenCalledWith({
        ...existingInventory,
        quantity: 2,
      });
    });

    it('should throw an error if inventory does not exist', async () => {
      mockSurvivorRepository.findOne.mockResolvedValue({ id: 1 });
      mockItemRepository.findOne.mockResolvedValue({ id: 1 });
      mockInventoryRepository.findOne.mockResolvedValue(null);
      await expect(service.removeItemFromInventory(1, 1, 3)).rejects.toThrow(
        'Inventory for survivor 1 and item 1 not found',
      );
    });
  });

  describe('getInventoryBySurvivorId', () => {
    it('should return all inventory items for a survivor', async () => {
      const survivorId = 1;
      const inventoryItems = [
        { id: 1, survivor: { id: survivorId } },
      ] as Inventory[];
      mockInventoryRepository.find.mockResolvedValue(inventoryItems);

      const result = await service.getInventoryBySurvivorId(survivorId);
      expect(mockInventoryRepository.find).toHaveBeenCalledWith({
        where: { survivor: { id: survivorId }, deletedAt: null },
      });
      expect(result).toEqual(inventoryItems);
    });
  });

  describe('checkInventory', () => {
    it('should return the quantity of a specific item in the inventory', async () => {
      const survivorId = 1;
      const itemId = 1;
      const inventoryItem = { quantity: 10 } as Inventory;

      mockSurvivorRepository.findOne.mockResolvedValue({ id: survivorId });
      mockInventoryRepository.findOne.mockResolvedValue(inventoryItem);

      const result = await service.checkInventory(survivorId, itemId);
      expect(result).toBe(10);
    });

    it('should throw NotFoundException if survivor is not found', async () => {
      mockSurvivorRepository.findOne.mockResolvedValue(null);
      await expect(service.checkInventory(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if inventory item is not found', async () => {
      mockSurvivorRepository.findOne.mockResolvedValue({ id: 1 });
      mockInventoryRepository.findOne.mockResolvedValue(null);
      await expect(service.checkInventory(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
