/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AuditAction } from '@/common/audit/audit.types';
import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async write(opts: {
    actorUserId: string | null;
    entityType: string;
    entityId: string | null;
    action: AuditAction;
    diff?: any;
  }) {
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
