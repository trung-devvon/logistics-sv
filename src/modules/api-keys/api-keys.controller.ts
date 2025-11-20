import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { ApiKeyAuthGuard } from '../auth/guards/api-key.guard';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Post()
  async create(@Request() req: any, @Body('name') name: string) {
    const userId = req.user.id;
    return this.apiKeysService.createApiKey(userId, name || 'Unnamed Key');
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
