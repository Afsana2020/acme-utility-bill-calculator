import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from './config.entity';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private configRepo: Repository<Config>,
  ) {}

  async getActiveConfig(): Promise<Config> {
    const config = await this.configRepo.findOne({ where: { id: 1 } });
    if (!config) {
      throw new NotFoundException('Configuration not found');
    }
    return config;
  }

  async updateConfig(dto: UpdateConfigDto): Promise<Config> {
    const config = await this.getActiveConfig();
    Object.assign(config, dto);
    config.updated_at = new Date();
    return this.configRepo.save(config);
  }
}