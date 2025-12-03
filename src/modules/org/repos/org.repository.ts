import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrgRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrgWithOwner(
    data: { name: string; code: string },
    ownerUserId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const org = await tx.org.create({
        data: { name: data.name, code: data.code },
      });
      await tx.userOrg.upsert({
        where: { userId_orgId: { userId: ownerUserId, orgId: org.id } },
        create: { userId: ownerUserId, orgId: org.id },
        update: {},
      });
      return org;
    });
  }

  async listOrgs(opts: { q?: string; cursor?: string; take: number }) {
    const where: Prisma.OrgWhereInput = opts.q
      ? {
          OR: [
            { name: { contains: opts.q, mode: 'insensitive' } },
            { code: { contains: opts.q, mode: 'insensitive' } },
          ],
        }
      : {};
    const items = await this.prisma.org.findMany({
      where,
      take: opts.take,
      skip: opts.cursor ? 1 : 0,
      cursor: opts.cursor ? { id: opts.cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, code: true, createdAt: true },
    });
    const nextCursor = items.length === opts.take ? items.at(-1).id : null;
    return { items, nextCursor };
  }

  getOrgById(id: string) {
    return this.prisma.org.findUnique({
      where: { id },
      select: { id: true, name: true, code: true, createdAt: true },
    });
  }

  updateOrg(id: string, data: { name?: string }) {
    return this.prisma.org.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        code: true,
        createdAt: true,
      },
    });
  }

  async deleteOrg(id: string) {
    await this.prisma.org.delete({ where: { id } });
  }

  async listMembers(orgId: string) {
    const rows = await this.prisma.userOrg.findMany({
      where: { orgId },
      select: {
        userId: true,
        user: { select: { email: true, fullName: true } },
      },
      orderBy: { userId: 'asc' },
    });
    return rows.map((r) => ({
      userId: r.userId,
      email: r.user.email,
      fullName: r.user.fullName,
    }));
  }

  async assignMember(orgId: string, userId: string) {
    await this.prisma.userOrg.upsert({
      where: { userId_orgId: { userId, orgId } },
      create: { userId, orgId },
      update: {},
    });
    return { ok: true };
  }

  async removeMember(orgId: string, userId: string) {
    await this.prisma.userOrg.delete({
      where: { userId_orgId: { orgId, userId } },
    });
    return { ok: true };
  }

  async listMembershipsByUser(userId: string) {
    const rows = await this.prisma.userOrg.findMany({
      where: { userId },
      select: { org: { select: { id: true, code: true, name: true } } },
    });
    return rows.map((r) => ({
      orgId: r.org.id,
      code: r.org.code,
      name: r.org.name,
    }));
  }

  async hasMembership(userId: string, orgId: string) {
    const found = await this.prisma.userOrg.findUnique({
      where: { userId_orgId: { userId, orgId } },
      select: { userId: true },
    });
    return !!found;
  }
}
