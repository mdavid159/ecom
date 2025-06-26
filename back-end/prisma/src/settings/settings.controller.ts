import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ChangeNameDto } from '../auth/dto/change-name.dto';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('products/stats/:id')
  async getStats(@Param('id') id: number) {
    return this.settingsService.getStats(id);
  }

  @Get('products/:id')
  async getProducts(@Param('id') id: string) {
    return this.settingsService.getProducts(id);
  }

  @Post('change-name/:id')
  async changeName(
    @Param('id') id: string,
    @Body() changeUserNameDto: ChangeNameDto,
  ) {
    return this.settingsService.changeUserName(id, changeUserNameDto);
  }
}
