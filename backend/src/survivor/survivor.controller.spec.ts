import { Test, TestingModule } from '@nestjs/testing';
import { SurvivorController } from './survivor.controller';
import { SurvivorService } from './survivor.service';
import { InventoryService } from '../inventory/inventory.service';
import { Survivor } from './survivor.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Item } from '../item/item.entity';

describe('SurvivorController', () => {
  let controller: SurvivorController;
  let survivorService: SurvivorService;
  let inventoryService: InventoryService;

  const mockSurvivorService = {
    createSurvivor: jest.fn(),
    updateSurvivor: jest.fn(),
    deleteSurvivor: jest.fn(),
    getAllSurvivors: jest.fn(),
    getSurvivorById: jest.fn(),
  };

  const mockInventoryService = {
    addItemToInventory: jest.fn(),
    getInventoryBySurvivorId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurvivorController],
      providers: [
        { provide: SurvivorService, useValue: mockSurvivorService },
        { provide: InventoryService, useValue: mockInventoryService },
      ],
    }).compile();

    controller = module.get<SurvivorController>(SurvivorController);
    survivorService = module.get<SurvivorService>(SurvivorService);
    inventoryService = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSurvivor', () => {
    it('should call createSurvivor on the service with the correct survivor', async () => {
      const survivor: Survivor = {
        id: 1,
        name: 'John Doe',
        age: 30,
        gender: 'M',
        infected: false,
      };
      mockSurvivorService.createSurvivor.mockResolvedValue(survivor);

      const result = await controller.createSurvivor(survivor);
      expect(survivorService.createSurvivor).toHaveBeenCalledWith(survivor);
      expect(result).toEqual(survivor);
    });
  });

  describe('updateSurvivor', () => {
    it('should call updateSurvivor on the service with the correct id and survivor', async () => {
      const survivor: Survivor = {
        id: 1,
        name: 'Updated Name',
        age: 31,
        gender: 'M',
        infected: false,
      };
      mockSurvivorService.updateSurvivor.mockResolvedValue(survivor);

      const result = await controller.updateSurvivor(1, survivor);
      expect(survivorService.updateSurvivor).toHaveBeenCalledWith(1, survivor);
      expect(result).toEqual(survivor);
    });
  });

  describe('deleteSurvivor', () => {
    it('should call deleteSurvivor on the service with the correct id', async () => {
      mockSurvivorService.deleteSurvivor.mockResolvedValue({ deleted: true });

      const result = await controller.deleteSurvivor(1);
      expect(survivorService.deleteSurvivor).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });

  describe('getAllSurvivors', () => {
    it('should return an array of survivors', async () => {
      const survivors: Survivor[] = [
        { id: 1, name: 'Survivor1', infected: false, age: 30, gender: 'M' },
        { id: 2, name: 'Survivor2', infected: true, age: 25, gender: 'F' },
      ];
      mockSurvivorService.getAllSurvivors.mockResolvedValue(survivors);

      const result = await controller.getAllSurvivors();
      expect(survivorService.getAllSurvivors).toHaveBeenCalled();
      expect(result).toEqual(survivors);
    });
  });

  describe('getSurvivorById', () => {
    it('should return a single survivor', async () => {
      const survivor: Survivor = {
        id: 1,
        name: 'Survivor1',
        infected: false,
        age: 30,
        gender: 'M',
      };
      mockSurvivorService.getSurvivorById.mockResolvedValue(survivor);

      const result = await controller.getSurvivorById(1);
      expect(survivorService.getSurvivorById).toHaveBeenCalledWith(1);
      expect(result).toEqual(survivor);
    });
  });

  describe('addItemToInventory', () => {
    it('should call addItemToInventory with the correct parameters', async () => {
      const itemId = 2;
      const quantity = 5;
      mockInventoryService.addItemToInventory.mockResolvedValue(undefined);

      const result = await controller.addItemToInventory(
        { itemId, quantity },
        1,
      );
      expect(inventoryService.addItemToInventory).toHaveBeenCalledWith(
        1,
        itemId,
        quantity,
      );
      expect(result).toEqual({ message: 'Item added to inventory' });
    });
  });

  describe('getInventoryBySurvivorId', () => {
    it('should return an inventory array for the specified survivor', async () => {
      const inventory: Inventory[] = [
        {
          id: 1,
          itemId: 1,
          quantity: 10,
          deletedAt: null,
          survivor: new Survivor(),
          survivorId: 0,
          item: new Item(),
        },
        {
          id: 2,
          itemId: 2,
          quantity: 5,
          deletedAt: null,
          survivor: new Survivor(),
          survivorId: 0,
          item: new Item(),
        },
      ];
      mockInventoryService.getInventoryBySurvivorId.mockResolvedValue(
        inventory,
      );

      const result = await controller.getInventoryBySurvivorId(1);
      expect(inventoryService.getInventoryBySurvivorId).toHaveBeenCalledWith(1);
      expect(result).toEqual(inventory);
    });
  });
});
