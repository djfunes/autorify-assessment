import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeInput } from './trade.input';

@Controller('trades')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post()
  createTrade(@Body() trade: TradeInput) {
    return this.tradeService.createTrade(trade);
  }


  @Get()
  getAllTrades() {
    return this.tradeService.getAllTrades();
  }

  @Get(':id')
  getTradeById(@Param('id') id: number) {
    return this.tradeService.getTradeById(id);
  }

  @Get('survivor/:id')
  getTradesBySurvivorId(@Param('id') id: number) {
    return this.tradeService.getTradesBySurvivorId(id);
  }
}