import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { ApiKeyAuthGuard } from '../../common/guards/api-key.guard';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER')
  @Post()
  async create(@Request() req: any, @Body('name') name: string) {
    const userId = req.user.id;
    return this.apiKeysService.createApiKey(userId, name || 'Unnamed Key');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER')
  @Get()
  async list(@Request() req: any) {
    const userId = req.user.id;
    return this.apiKeysService.listApiKeys(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER')
  @Delete(':id')
  async revoke(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    await this.apiKeysService.revokeApiKey(userId, id);
    return { message: 'Đã thu hồi API Key thành công' };
  }

  /**
   * 2. TEST API KEY
   * Endpoint này chỉ gọi được nếu có X-API-KEY hợp lệ
   */
  @UseGuards(ApiKeyAuthGuard) // <--- Bảo vệ bằng API Key
  @Get('test')
  testApiKey(@Request() req: any) {
    return {
      message: 'Success',
      key_info: req.user, // Trả về thông tin của Key record
    };
  }
}
