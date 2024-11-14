import { Test, TestingModule } from '@nestjs/testing';
import { SurvivorService } from './survivor.service';
import { Survivor } from './survivor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('SurvivorService', () => {
  let service: SurvivorService;
  let survivorRepository: Repository<Survivor>;

  const mockSurvivorRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurvivorService,
        {
          provide: getRepositoryToken(Survivor),
          useValue: mockSurvivorRepository,
        },
      ],
    }).compile();

    service = module.get<SurvivorService>(SurvivorService);
    survivorRepository = module.get<Repository<Survivor>>(
      getRepositoryToken(Survivor),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSurvivor', () => {
    it('should save and return the created survivor', async () => {
      const survivor = new Survivor();
      mockSurvivorRepository.save.mockResolvedValue(survivor);

      const result = await service.createSurvivor(survivor);
      expect(result).toEqual(survivor);
      expect(mockSurvivorRepository.save).toHaveBeenCalledWith(survivor);
    });
  });

  describe('updateSurvivor', () => {
    it('should update and return the survivor if it exists', async () => {
      const survivor = new Survivor();
      survivor.id = 1;
      survivor.name = 'Original Name';
      const updatedSurvivor = { ...survivor, name: 'Updated Name' };
      
      // Mock findOne to return the survivor
      mockSurvivorRepository.findOne.mockResolvedValue(survivor);
      // Mock merge to return the updated survivor object
      mockSurvivorRepository.merge.mockReturnValue(updatedSurvivor);
      // Mock save to return the updated survivor
      mockSurvivorRepository.save.mockResolvedValue(updatedSurvivor);
  
      const result = await service.updateSurvivor(1, updatedSurvivor);
      expect(result).toEqual(updatedSurvivor);
      expect(mockSurvivorRepository.merge).toHaveBeenCalledWith(survivor, updatedSurvivor);
      expect(mockSurvivorRepository.save).toHaveBeenCalledWith(updatedSurvivor);
    });
  
    it('should throw an error if the survivor does not exist', async () => {
      // Mock findOne to return null
      mockSurvivorRepository.findOne.mockResolvedValue(null);
  
      await expect(service.updateSurvivor(1, new Survivor())).rejects.toThrow(
        'Survivor with ID 1 not found',
      );
    });
  });
  

  describe('deleteSurvivor', () => {
    it('should set deletedAt and save the survivor if it exists', async () => {
      const survivor = new Survivor();
      survivor.id = 1;
      // Mock findOne to return the survivor
      mockSurvivorRepository.findOne.mockResolvedValue(survivor);
      mockSurvivorRepository.save.mockResolvedValue(survivor);
  
      const result = await service.deleteSurvivor(1);
      expect(result.deletedAt).toBeDefined();
      expect(mockSurvivorRepository.save).toHaveBeenCalledWith(survivor);
    });
  
    it('should throw an error if the survivor does not exist', async () => {
      // Mock findOne to return null
      mockSurvivorRepository.findOne.mockResolvedValue(null);
  
      await expect(service.deleteSurvivor(1)).rejects.toThrow(
        'Survivor with ID 1 not found',
      );
    });
  });

  describe('getAllSurvivors', () => {
    it('should return all non-deleted survivors', async () => {
      const survivors = [new Survivor(), new Survivor()];
      mockSurvivorRepository.find.mockResolvedValue(survivors);

      const result = await service.getAllSurvivors();
      expect(result).toEqual(survivors);
      expect(mockSurvivorRepository.find).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
    });
  });

  describe('getSurvivorById', () => {
    it('should return the survivor with the given ID if it exists and is not deleted', async () => {
      const survivor = new Survivor();
      mockSurvivorRepository.findOne.mockResolvedValue(survivor);

      const result = await service.getSurvivorById(1);
      expect(result).toEqual(survivor);
      expect(mockSurvivorRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: null },
      });
    });

    it('should return null if the survivor does not exist or is deleted', async () => {
      mockSurvivorRepository.findOne.mockResolvedValue(null);

      const result = await service.getSurvivorById(1);
      expect(result).toBeNull();
    });
  });
});
