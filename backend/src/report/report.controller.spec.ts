import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('ReportController', () => {
  let controller: ReportController;
  let reportService: ReportService;

  const mockReportService = {
    getInfectedSurvivorsPercentage: jest.fn(),
    getNonInfectedSurvivorsPercentage: jest.fn(),
    getAverageResourcesBySurvivor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [{ provide: ReportService, useValue: mockReportService }],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    reportService = module.get<ReportService>(ReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInfectedSurvivorsPercentage', () => {
    it('should return the infected survivors percentage', async () => {
      const infectedSurvivors = 45; // Mock percentage
      mockReportService.getInfectedSurvivorsPercentage.mockResolvedValue(
        infectedSurvivors,
      );

      const result = await controller.getInfectedSurvivorsPercentage();
      expect(reportService.getInfectedSurvivorsPercentage).toHaveBeenCalled();
      expect(result).toEqual({ infectedSurvivors });
    });
  });

  describe('getNonInfectedSurvivorsPercentage', () => {
    it('should return the non-infected survivors percentage', async () => {
      const nonInfectedSurvivors = 55; // Mock percentage
      mockReportService.getNonInfectedSurvivorsPercentage.mockResolvedValue(
        nonInfectedSurvivors,
      );

      const result = await controller.getNonInfectedSurvivorsPercentage();
      expect(
        reportService.getNonInfectedSurvivorsPercentage,
      ).toHaveBeenCalled();
      expect(result).toEqual({ nonInfectedSurvivors });
    });
  });

  describe('getAverageResourcesBySurvivor', () => {
    it('should return the average resources per survivor', async () => {
      const averageResources = 3.5; // Mock average resources
      mockReportService.getAverageResourcesBySurvivor.mockResolvedValue(
        averageResources,
      );

      const result = await controller.getAverageResourcesBySurvivor();
      expect(reportService.getAverageResourcesBySurvivor).toHaveBeenCalled();
      expect(result).toEqual({ averageResources });
    });
  });
});
