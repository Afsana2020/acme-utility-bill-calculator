import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('config')
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rate_per_unit: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  vat_percentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fixed_service_charge: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}