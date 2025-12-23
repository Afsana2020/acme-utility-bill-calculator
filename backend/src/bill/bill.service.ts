import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class BillService {
  constructor(private configService: ConfigService) {}

  async calculateBill(units: number) {
    const config = await this.configService.getActiveConfig();

    const rate = parseFloat(config.rate_per_unit as any);
    const vatPercent = parseFloat(config.vat_percentage as any);
    const serviceCharge = parseFloat(config.fixed_service_charge as any);

    const subtotal = units * rate;
    const vatAmount = subtotal * (vatPercent / 100);
    const total = subtotal + vatAmount + serviceCharge;


    return {
      units: units,
      rate: rate,
      subtotal: Number(subtotal.toFixed(2)),
      vat: vatPercent,
      vatAmount: Number(vatAmount.toFixed(2)),
      serviceCharge: serviceCharge,
      total: Number(total.toFixed(2)),
    };
  }
}