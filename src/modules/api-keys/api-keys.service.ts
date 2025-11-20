import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { PrismaService } from '@/core/prisma/prisma.service';
import { randomBytes } from 'crypto';
import { SHA256 } from 'crypto-js';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}
  async createApiKey(userId: string, name: string) {
    const privateKey = randomBytes(32).toString('hex');
    // hash
    const privateKeyHash = SHA256(privateKey).toString();

    const apiKeyRecord = await this.prisma.apiKey.create({
      data: {
        name: name,
        ownerUserId: userId,
        keyHash: privateKeyHash, // save hash of private key
        scopes: 'general',
      },
    });

    const fullKey = `apiKey_${apiKeyRecord.id}.${privateKey}`;

    return {
      id: apiKeyRecord.id,
      name: apiKeyRecord.name,
      apiKey: fullKey, // Client sẽ dùng chuỗi này để gọi API
      message: 'Đây là API Key duy nhất của bạn. Hãy lưu nó lại vì hệ thống sẽ không hiển thị lại Private Key.',
    };
  }

  async validateApiKey(rawKey: string) {
    const prefix = 'apiKey_';
    if (!rawKey || !rawKey.startsWith(prefix)) {
      return null;
    }

    // tách 2
    const tokenPart = rawKey.slice(prefix.length);
    const [publicKey, privateKey] = tokenPart.split('.');
    
    if (!publicKey || !privateKey) {
      return null;
    }

    const apiKeyRecord = await this.prisma.apiKey.findUnique({
      where: { id: publicKey }, //
      include: { owner: true },
    });

    // Kiểm tra tồn tại và trạng thái thu hồi
    if (!apiKeyRecord || apiKeyRecord.revokedAt) {
      return null;
    }

    const inputHash = SHA256(privateKey).toString();

    if (inputHash !== apiKeyRecord.keyHash) {
      return null;
    }

    // F. Hợp lệ
    return apiKeyRecord;
  }


  
}
