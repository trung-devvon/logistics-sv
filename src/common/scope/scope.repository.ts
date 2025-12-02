/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScopeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async isUserMemberOfOrg(userId: string, orgId: string): Promise<boolean> {
    const row = await this.prisma.userOrg.findUnique({
      where: { userId_orgId: { userId, orgId } },
      select: { userId: true },
    });
    return !!row;
  }

  async hubBelongsToOrg(
    hubId: string,
    orgId: string,
  ): Promise<{ ok: boolean; regionCode?: string | null }> {
    const hub = await this.prisma.hub.findUnique({
      where: { id: hubId },
      // nếu có cột regionCode, bật nó ở đây
      select: { id: true, orgId: true /*, regionCode: true*/ },
    });
    if (!hub || hub.orgId !== orgId) return { ok: false };
    // @ts-expect-error: mở khi bạn thêm cột regionCode
    return { ok: true, regionCode: hub.regionCode ?? null };
  }
}
