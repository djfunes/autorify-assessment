import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { Survivor } from '../survivor/survivor.entity';
import { Inventory } from '../inventory/inventory.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportService', () => {
  let service: ReportService;

  const mockSurvivorRepository = {
    count: jest.fn(),
  };

  const mockInventoryRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(Survivor),
          useValue: mockSurvivorRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInfectedSurvivorsPercentage', () => {
    it('should return the correct percentage of infected survivors', async () => {
      const totalSurvivors = 100;
      const infectedSurvivors = 20;
      // Mocking total survivors count first
      mockSurvivorRepository.count.mockResolvedValueOnce(totalSurvivors);
      // Mocking infected survivors count second
      mockSurvivorRepository.count.mockResolvedValueOnce(infectedSurvivors);

      const result = await service.getInfectedSurvivorsPercentage();
      expect(result).toBe((infectedSurvivors / totalSurvivors) * 100);
    });

    it('should return 0 if there are no survivors', async () => {
      mockSurvivorRepository.count.mockResolvedValueOnce(0); // no survivors

      const result = await service.getInfectedSurvivorsPercentage();
      expect(result).toBe(0);
    });
  });

  describe('getNonInfectedSurvivorsPercentage', () => {
    it('should return the correct percentage of non-infected survivors', async () => {
      const totalSurvivors = 100;
      const nonInfectedSurvivors = 80;
      // Mocking total survivors count first
      mockSurvivorRepository.count.mockResolvedValueOnce(totalSurvivors);
      // Mocking non-infected survivors count second
      mockSurvivorRepository.count.mockResolvedValueOnce(nonInfectedSurvivors);

      const result = await service.getNonInfectedSurvivorsPercentage();
      expect(result).toBe((nonInfectedSurvivors / totalSurvivors) * 100);
    });

    it('should return 0 if there are no infected survivors', async () => {
      mockSurvivorRepository.count.mockResolvedValueOnce(0); // no survivors

      const result = await service.getNonInfectedSurvivorsPercentage();
      expect(result).toBe(0);
    });
  });

  describe('getAverageResourcesBySurvivor', () => {
    it('should return the average number of resources per survivor', async () => {
      const totalSurvivors = 100;
      const resources = 500;
      mockSurvivorRepository.count.mockResolvedValueOnce(totalSurvivors);
      mockInventoryRepository.createQueryBuilder().getRawOne.mockResolvedValue({
        sum: resources,
      });

      const result = await service.getAverageResourcesBySurvivor();
      expect(result).toBe(resources / totalSurvivors);
    });

    it('should return 0 if there are no survivors', async () => {
      mockSurvivorRepository.count.mockResolvedValueOnce(0); // no survivors

      const result = await service.getAverageResourcesBySurvivor();
      expect(result).toBe(0);
    });
  });
});
