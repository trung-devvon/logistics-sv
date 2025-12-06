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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

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
  @ApiOperation({ summary: 'Create new API Key' })
  @ApiCreatedResponse({ description: 'API key created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - insufficient role' })
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
  @ApiOperation({ summary: 'List API keys for current user' })
  @ApiOkResponse({ description: 'List of API keys' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async list(@Request() req: any) {
    const userId = req.user.id;
    return this.apiKeysService.listApiKeys(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PARTNER')
  @Delete(':id')
  @ApiOperation({ summary: 'Revoke an API key' })
  @ApiOkResponse({ description: 'API key revoked' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - insufficient role' })
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
  @ApiOperation({ summary: 'Test API Key access (X-API-KEY)' })
  @ApiOkResponse({ description: 'API Key valid' })
  testApiKey(@Request() req: any) {
    return {
      message: 'Success',
      key_info: req.user, // Trả về thông tin của Key record
    };
  }
}
