import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survivor } from '../survivor/survivor.entity';
import { Inventory } from '../inventory/inventory.entity';
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Survivor)
    private readonly survivorRepository: Repository<Survivor>,

    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async getInfectedSurvivorsPercentage() {
    const totalSurvivors = await this.survivorRepository.count({
      where: { deletedAt: null },
    });
    const infectedSurvivors = await this.survivorRepository.count({
      where: { infected: true, deletedAt: null },
    });
    return totalSurvivors > 0 ? (infectedSurvivors / totalSurvivors) * 100 : 0;
  }

  async getNonInfectedSurvivorsPercentage() {
    const totalSurvivors = await this.survivorRepository.count({
      where: { deletedAt: null },
    });
    const nonInfectedSurvivors = await this.survivorRepository.count({
      where: { infected: false, deletedAt: null },
    });
    return totalSurvivors > 0
      ? (nonInfectedSurvivors / totalSurvivors) * 100
      : 0;
  }

  async getAverageResourcesBySurvivor() {
    const totalSurvivors = await this.survivorRepository.count({
      where: { deletedAt: null },
    });
    const resources = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.deletedAt IS NULL')
      .select('SUM(inventory.quantity)', 'sum')
      .getRawOne();
    const totalResources = resources.sum || 0;
    const averageResources =
      totalSurvivors > 0 ? totalResources / totalSurvivors : 0;
    return averageResources;
  }
}
