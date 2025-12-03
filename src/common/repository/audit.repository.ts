/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AuditWriteOptions } from '../schemas/audit.schema';

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async write(opts: AuditWriteOptions) {
    await this.prisma.auditLog.create({
      data: {
        actorUserId: opts.actorUserId,
        entityType: opts.entityType,
        entityId: String(opts.entityId ?? ''),
        action: opts.action,
        diff: opts.diff ?? undefined,
      },
    });
  }
}
