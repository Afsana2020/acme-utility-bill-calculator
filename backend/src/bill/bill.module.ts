import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule], 
  providers: [BillService],
  controllers: [BillController],
})
export class BillModule {}