import { IsNumber, Min } from 'class-validator';

export class CalculateBillDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Units must be a positive number' })
  units: number;
}