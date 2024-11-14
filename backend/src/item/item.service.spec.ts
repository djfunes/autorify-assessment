import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { Repository } from 'typeorm';

describe('ItemService', () => {
  let service: ItemService;
  let itemRepository: Repository<Item>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(Item),
          useValue: {
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    itemRepository = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createItem', () => {
    it('should successfully create an item', async () => {
      const newItem: Item = {
        id: 1,
        name: 'Test Item',
        description: 'Test Description',
        deletedAt: null,
      };
      (itemRepository.save as jest.Mock).mockResolvedValue(newItem);

      const result = await service.createItem(newItem);
      expect(result).toEqual(newItem);
      expect(itemRepository.save).toHaveBeenCalledWith(newItem);
    });
  });

  describe('updateItem', () => {
    it('should successfully update an existing item', async () => {
      const mockItem = new Item();
      mockItem.id = 1;
      mockItem.name = 'Item 1';
      mockItem.deletedAt = null;

      const updatedItem = {
        id: 1,
        name: 'Updated Item',
        description: 'Updated Description',
      };

      // Mocking the findOneOrFail method
      (itemRepository.findOneOrFail as jest.Mock).mockResolvedValue(mockItem);
      (itemRepository.merge as jest.Mock).mockReturnValue({
        ...mockItem,
        ...updatedItem,
      });
      (itemRepository.save as jest.Mock).mockResolvedValue({
        ...mockItem,
        ...updatedItem,
      });

      const result = await service.updateItem(1, updatedItem);

      expect(itemRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: null },
      });
      expect(itemRepository.merge).toHaveBeenCalledWith(mockItem, updatedItem);
      expect(itemRepository.save).toHaveBeenCalledWith({
        ...mockItem,
        ...updatedItem,
      });
      expect(result).toEqual({ ...mockItem, ...updatedItem });
    });

    it('should throw an error if item is not found', async () => {
      const updatedItem = {
        id: 1,
        name: 'Updated Item',
        description: 'Updated Description',
      };

      // Mocking the findOneOrFail method to throw an error (item not found)
      (itemRepository.findOneOrFail as jest.Mock).mockRejectedValue(
        new Error('Item with ID 1 not found'),
      );

      await expect(service.updateItem(1, updatedItem)).rejects.toThrowError(
        'Item with ID 1 not found',
      );
    });
  });

  describe('deleteItem', () => {
    it('should successfully delete an item', async () => {
      const id = 1;
      const existingItem: Item = {
        id: 1,
        name: 'Test Item',
        description: 'Test Description',
        deletedAt: null,
      };
      
      // Mocking findOne to return the existing item
      (itemRepository.findOne as jest.Mock).mockResolvedValue(existingItem);
      // Mocking save to simulate the deletion
      (itemRepository.save as jest.Mock).mockResolvedValue({
        ...existingItem,
        deletedAt: new Date(),
      });
  
      const result = await service.deleteItem(id);
      expect(result.deletedAt).not.toBeNull(); // Check that deletedAt is set
      expect(itemRepository.findOne).toHaveBeenCalledWith({
        where: { id, deletedAt: null },
      });
      expect(itemRepository.save).toHaveBeenCalledWith({
        ...existingItem,
        deletedAt: expect.any(Date),
      });
    });
  
    it('should throw an error if item is not found', async () => {
      const id = 1;
      // Mocking findOne to return null
      (itemRepository.findOne as jest.Mock).mockResolvedValue(null);
  
      await expect(service.deleteItem(id)).rejects.toThrowError(
        `Item with ID ${id} not found`,
      );
    });
  });

  describe('getAllItems', () => {
    it('should return a list of items', async () => {
      const items: Item[] = [
        {
          id: 1,
          name: 'Item 1',
          description: 'Description 1',
          deletedAt: null,
        },
        {
          id: 2,
          name: 'Item 2',
          description: 'Description 2',
          deletedAt: null,
        },
      ];

      (itemRepository.find as jest.Mock).mockResolvedValue(items);

      const result = await service.getAllItems();
      expect(result).toEqual(items);
      expect(itemRepository.find).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
    });
  });

  describe('getItemById', () => {
    it('should return an item by id', async () => {
      const id = 1;
      const item: Item = {
        id: 1,
        name: 'Test Item',
        description: 'Test Description',
        deletedAt: null,
      };
  
      // Mocking findOne to return the item
      (itemRepository.findOne as jest.Mock).mockResolvedValue(item);
  
      const result = await service.getItemById(id);
      expect(result).toEqual(item);
      expect(itemRepository.findOne).toHaveBeenCalledWith({
        where: { id, deletedAt: null },
      });
    });
  
    it('should return null if item is not found', async () => {
      const id = 1;
      // Mocking findOne to return null
      (itemRepository.findOne as jest.Mock).mockResolvedValue(null);
  
      const result = await service.getItemById(id);
      expect(result).toBeNull();
    });
  });
});
