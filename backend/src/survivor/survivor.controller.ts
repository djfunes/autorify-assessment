import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { SurvivorService } from './survivor.service';
import { Survivor } from './survivor.entity';
import { InventoryService } from '../inventory/inventory.service';
import { Inventory } from '../inventory/inventory.entity';

@Controller('survivors')
export class SurvivorController {
  constructor(
    private readonly survivorService: SurvivorService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Post()
  createSurvivor(@Body() survivor: Survivor) {
    return this.survivorService.createSurvivor(survivor);
  }

  @Put(':id')
  updateSurvivor(@Param('id') id: number, @Body() survivor: Survivor) {
    return this.survivorService.updateSurvivor(id, survivor);
  }

  @Delete(':id')
  deleteSurvivor(@Param('id') id: number) {
    return this.survivorService.deleteSurvivor(id);
  }

  @Get()
  getAllSurvivors() {
    return this.survivorService.getAllSurvivors();
  }

  @Get(':id')
  getSurvivorById(@Param('id') id: number) {
    return this.survivorService.getSurvivorById(id);
  }

  @Post(':id/inventory/add')
  async addItemToInventory(
    @Body() { itemId, quantity }: any,
    @Param('id') id: number,
  ) {
    await this.inventoryService.addItemToInventory(id, itemId, quantity);
    return { message: 'Item added to inventory' };
  }

  @Get(':id/inventory')
  async getInventoryBySurvivorId(
    @Param('id') survivorId: number,
  ): Promise<Inventory[]> {
    return this.inventoryService.getInventoryBySurvivorId(survivorId);
  }
}
