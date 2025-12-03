import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { JwtService } from '@nestjs/jwt';
import { OrgRepository } from './repos/org.repository';

@Injectable()
export class OrgService {
  constructor(
    private readonly repo: OrgRepository,
    private readonly jwt: JwtService,
  ) {}

  async createOrg(dto: CreateOrgDto, ownerUserId: string) {
    const org = await this.repo.createOrgWithOwner(
      { name: dto.name, code: dto.code },
      ownerUserId,
    );
    return {
      id: org.id,
      name: org.name,
      code: org.code,
      createdAt: org.createdAt,
    };
  }

  listOrgs(opts: { q?: string; cursor?: string; take: number }) {
    return this.repo.listOrgs(opts);
  }

  async getOrg(id: string) {
    const org = await this.repo.getOrgById(id);
    if (!org) throw new ForbiddenException('ORG_NOT_FOUND');
    return {
      id: org.id,
      name: org.name,
      code: org.code,
      createdAt: org.createdAt,
    };
  }

  async updateOrg(id: string, dto: UpdateOrgDto) {
    const org = await this.repo.updateOrg(id, { name: dto.name });
    return {
      id: org.id,
      name: org.name,
      code: org.code,
      createdAt: org.createdAt,
    };
  }

  async deleteOrg(id: string) {
    await this.repo.deleteOrg(id);
    return { ok: true };
  }

  async listMembers(orgId: string) {
    return this.repo.listMembers(orgId);
  }

  async assignMember(orgId: string, userId: string) {
    return this.repo.assignMember(orgId, userId);
  }

  async removeMember(orgId: string, userId: string) {
    return this.repo.removeMember(orgId, userId);
  }

  myMemberships(userId: string) {
    return this.repo.listMembershipsByUser(userId);
  }

  async switchOrg(orgId: string, userId: string) {
    const ok = await this.repo.hasMembership(userId, orgId);
    if (!ok) throw new ForbiddenException('NO_SCOPE: cannot switch to org');

    const accessToken = await this.jwt.signAsync(
      { sub: userId, orgId },
      { expiresIn: '1h' },
    );
    return { accessToken };
  }
}
