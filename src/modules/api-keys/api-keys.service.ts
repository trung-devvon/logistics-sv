import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { PrismaService } from '@/core/prisma/prisma.service';
import { randomBytes } from 'crypto';
import { SHA256 } from 'crypto-js';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  //* LIỆT KÊ API KEY CỦA USER
  async listApiKeys(userId: string) {
    return this.prisma.apiKey.findMany({
      where: {
        ownerUserId: userId,
        revokedAt: null, // Chỉ lấy key đang hoạt động
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        // KHÔNG BAO GIỜ trả về keyHash
      },
    });
  }

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
      message:
        'Đây là API Key duy nhất của bạn. Hãy lưu nó lại vì hệ thống sẽ không hiển thị lại Private Key.',
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
      where: { id: publicKey },
      select: {
        id: true,
        name: true,
        scopes: true,
        keyHash: true,
        createdAt: true,
        revokedAt: true,
        owner: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    // Kiểm tra tồn tại và trạng thái thu hồi
    if (!apiKeyRecord || apiKeyRecord.revokedAt) {
      return null;
    }

    const inputHash = SHA256(privateKey).toString();

    if (inputHash !== apiKeyRecord.keyHash) {
      return null;
    }
    const {keyHash, ...rest} = apiKeyRecord;

    return rest;
  }

  /**
   * 4. THU HỒI (XÓA) KEY
   * Dùng khi customer muốn "Tạo lại" hoặc nghi ngờ key bị lộ
   */
  async revokeApiKey(userId: string, apiKeyId: string) {
    // A. Tìm key
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id: apiKeyId },
    });

    if (!apiKey) {
      throw new NotFoundException('API Key không tồn tại');
    }

    if (apiKey.ownerUserId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa Key này');
    }

    return this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { revokedAt: new Date() },
    });
  }
}
