import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('infected-survivors')
  async getInfectedSurvivorsPercentage() {
    const infectedSurvivors =
      await this.reportService.getInfectedSurvivorsPercentage();
    return { infectedSurvivors };
  }

  @Get('non-infected-survivors')
  async getNonInfectedSurvivorsPercentage() {
    const nonInfectedSurvivors =
      await this.reportService.getNonInfectedSurvivorsPercentage();
    return { nonInfectedSurvivors };
  }

  @Get('average-resources')
  async getAverageResourcesBySurvivor() {
    const averageResources =
      await this.reportService.getAverageResourcesBySurvivor();
    return { averageResources };
  }
}
