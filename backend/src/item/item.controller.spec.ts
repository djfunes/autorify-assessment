import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from './item.entity';

describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

  const mockItemService = {
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
    getAllItems: jest.fn(),
    getItemById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: mockItemService,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createItem', () => {
    it('should call createItem on the service with the correct item', async () => {
      const item: Item = {
        id: 1,
        name: 'Item1',
        description: 'Description1',
      };
      mockItemService.createItem.mockResolvedValue(item);

      const result = await controller.createItem(item);
      expect(service.createItem).toHaveBeenCalledWith(item);
      expect(result).toEqual(item);
    });
  });

  describe('updateItem', () => {
    it('should call updateItem on the service with the correct id and item', async () => {
      const item: Item = {
        id: 1,
        name: 'UpdatedItem',
        description: 'UpdatedDescription',
      };
      mockItemService.updateItem.mockResolvedValue(item);

      const result = await controller.updateItem(1, item);
      expect(service.updateItem).toHaveBeenCalledWith(1, item);
      expect(result).toEqual(item);
    });
  });

  describe('deleteItem', () => {
    it('should call deleteItem on the service with the correct id', async () => {
      mockItemService.deleteItem.mockResolvedValue({ deleted: true });

      const result = await controller.deleteItem(1);
      expect(service.deleteItem).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });

  describe('getAllItems', () => {
    it('should return an array of items', async () => {
      const items: Item[] = [
        { id: 1, name: 'Item1', description: 'Description1' },
        { id: 2, name: 'Item2', description: 'Description2' },
      ];
      mockItemService.getAllItems.mockResolvedValue(items);

      const result = await controller.getAllItems();
      expect(service.getAllItems).toHaveBeenCalled();
      expect(result).toEqual(items);
    });
  });

  describe('getItemById', () => {
    it('should return a single item', async () => {
      const item: Item = { id: 1, name: 'Item1', description: 'Description1' };
      mockItemService.getItemById.mockResolvedValue(item);

      const result = await controller.getItemById(1);
      expect(service.getItemById).toHaveBeenCalledWith(1);
      expect(result).toEqual(item);
    });
  });
});
