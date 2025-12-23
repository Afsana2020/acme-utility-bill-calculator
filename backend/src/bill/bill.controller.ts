import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { BillService } from './bill.service';
import { CalculateBillDto } from './dto/calculate-bill.dto';

@Controller('config/bill') 
export class BillController {
  constructor(private billService: BillService) {}

  @Post('calculate')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async calculate(@Body() dto: CalculateBillDto) {
    return this.billService.calculateBill(dto.units,dto.name);
  }
}