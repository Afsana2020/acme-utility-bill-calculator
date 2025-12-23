import { IsString,IsNumber, Min } from 'class-validator';

export class CalculateBillDto {
  @IsString()
  name: string; 

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Units must be a positive number' })
  units: number;
}