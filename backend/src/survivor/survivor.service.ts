import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survivor } from './survivor.entity';

@Injectable()
export class SurvivorService {
  constructor(
    @InjectRepository(Survivor)
    private readonly survivorRepository: Repository<Survivor>,
  ) {}

  async createSurvivor(survivor: Survivor) {
    return this.survivorRepository.save(survivor);
  }

  async updateSurvivor(id: number, survivor: Survivor) {
    const existingSurvivor = await this.survivorRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!existingSurvivor) {
      throw new Error(`Survivor with ID ${id} not found`);
    }
    const updatedSurvivor = this.survivorRepository.merge(
      existingSurvivor,
      survivor,
    );

    return this.survivorRepository.save(updatedSurvivor);
  }

  async deleteSurvivor(id: number) {
    const existingSurvivor = await this.survivorRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!existingSurvivor) {
      throw new Error(`Survivor with ID ${id} not found`);
    } else {
      const survivor = existingSurvivor;
      survivor.deletedAt = new Date();
      return this.survivorRepository.save(survivor);
    }
  }

  async getAllSurvivors() {
    return this.survivorRepository.find({
      where: { deletedAt: null },
    });
  }

  async getSurvivorById(id: number) {
    return this.survivorRepository.findOne({
      where: { id, deletedAt: null },
    });
  }
}
