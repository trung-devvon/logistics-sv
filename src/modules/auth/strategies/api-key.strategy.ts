import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ApiKeysService } from '@/modules/api-keys/api-keys.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private apiKeyService: ApiKeysService) {
    super();
  }

  async validate(req: any): Promise<any> {
    // Lưu ý: Trong Node.js/Fastify, tên header thường được tự động chuyển về chữ thường
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      throw new UnauthorizedException('API Key không được tìm thấy');
    }

    const apiKeyRecord = await this.apiKeyService.validateApiKey(apiKey);

    if (!apiKeyRecord) {
      throw new UnauthorizedException('API Key không hợp lệ');
    }

    // 3. Trả về thông tin (sẽ được gắn vào req.user)
    // Vì đây là máy gọi, trả về thông tin của Key đó
    return apiKeyRecord;
  }
}
