import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto.ts';
import { CreateServiceLevelDto } from './dto/create-service-level.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { UpdateServiceLevelDto } from './dto/update-service-level.dto';
import { ConfigRefRepository } from './repos/config-ref.repository';
import { IListRegions } from './interfaces/config-ref.interface.js';

@Injectable()
export class ConfigRefService {
  constructor(private readonly repo: ConfigRefRepository) {}

  // ---- Regions ----
  createRegion(dto: CreateRegionDto) {
    return this.repo.createRegion({ code: dto.code, name: dto.name });
  }

  listRegions(opts: IListRegions) {
    return this.repo.listRegions(opts);
  }

  async getRegion(id: string) {
    const row = await this.repo.getRegion(id);
    if (!row) throw new ForbiddenException('REGION_NOT_FOUND');
    return row;
  }

  updateRegion(id: string, dto: UpdateRegionDto) {
    return this.repo.updateRegion(id, { name: dto.name, active: dto.active });
  }

  deleteRegion(id: string) {
    return this.repo.deleteRegion(id);
  }

  // ---- Service Levels (per org) ----
  createServiceLevel(dto: CreateServiceLevelDto) {
    return this.repo.createServiceLevel({
      orgId: dto.orgId,
      code: dto.code,
      name: dto.name,
    });
  }

  listServiceLevels(orgId: string, opts: IListRegions) {
    return this.repo.listServiceLevels({ orgId, ...opts });
  }

  async getServiceLevel(id: string) {
    const row = await this.repo.getServiceLevel(id);
    if (!row) throw new ForbiddenException('SERVICE_LEVEL_NOT_FOUND');
    return row;
  }

  updateServiceLevel(id: string, dto: UpdateServiceLevelDto) {
    return this.repo.updateServiceLevel(id, {
      name: dto.name,
      active: dto.active,
    });
  }

  deleteServiceLevel(id: string) {
    return this.repo.deleteServiceLevel(id);
  }
}
