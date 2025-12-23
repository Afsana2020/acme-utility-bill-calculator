import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getConfig() {
    return this.configService.getActiveConfig();
  }

  @Post('update')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateConfig(
    @Body() dto: UpdateConfigDto,
    @Headers('x-admin-pin') pin: string,
  ) {
    if (pin !== process.env.ADMIN_PIN) {
      throw new UnauthorizedException('Invalid admin PIN');
    }
    return this.configService.updateConfig(dto);
  }
}