import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { ApiKeyAuthGuard } from '../../common/guards/api-key.guard';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('API Keys')
@ApiBearerAuth('JWT-auth')
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) { }

  /**
   * 1. TẠO API KEY
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PARTNER')
  @Post()
  @ApiOperation({ summary: 'Tạo API Key mới' })
  @ApiCreatedResponse({ description: 'Tạo thành công. Trả về API Key (chỉ hiển thị 1 lần).' })
  async create(@Request() req: any, @Body() dto: CreateApiKeyDto) {
    const userId = req.user.id;
    const keyName = dto.name || 'Partner API Key';
    return this.apiKeysService.createApiKey(userId, keyName);
  }

  /**
   * 2. LẤY DANH SÁCH API KEY
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PARTNER')
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách API Key của tôi' })
  @ApiOkResponse({ description: 'Danh sách API Key đang hoạt động.' })
  async list(@Request() req: any) {
    const userId = req.user.id;
    return this.apiKeysService.listApiKeys(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PARTNER')
  @Delete(':id')
  @ApiOperation({ summary: 'Thu hồi (Xóa) API Key' })
  @ApiOkResponse({ description: 'Thu hồi thành công.' })
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
  @ApiSecurity('api-key') // Định nghĩa trong Swagger config
  @ApiOperation({ summary: 'Test API Key' })
  @ApiOkResponse({ description: 'API Key hợp lệ.' })
  testApiKey(@Request() req: any) {
    return {
      message: 'Success',
      key_info: req.user, // Trả về thông tin của Key record
    };
  }
}
