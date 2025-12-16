import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GeocodeDto } from './dto/geocode.dto';
import { ReverseGeocodeDto } from './dto/reverse-geocode.dto';
import { DistanceMatrixDto } from './dto/distance-matrix.dto';
import { GeoService } from './geo-distance.service';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentOrgId } from '@/common/decorators/current-org-id.decorator';
import { UseAudit } from '@/common/decorators/audit.decorator';
import { AuditAction } from '@/common/types/audit.types';

@ApiTags('Geo')
@ApiBearerAuth()
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HUB_MANAGER', 'DISPATCHER')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('geo')
export class GeoController {
  constructor(private readonly service: GeoService) {}

  @Post('geocode')
  @UseAudit({ entity: 'GeocodingCache', action: AuditAction.Read })
  @Permissions('routes:read')
  @ApiOkResponse({ description: 'Geocode địa chỉ -> toạ độ (có cache TTL)' })
  geocode(
    @CurrentOrgId() orgId: string,
    @CurrentUser() user: any,
    @Body() dto: GeocodeDto,
  ) {
    return this.service.geocode(orgId, user?.id ?? null, dto);
  }

  @Post('reverse-geocode')
  @UseAudit({ entity: 'GeocodingCache', action: AuditAction.Read })
  @Permissions('routes:read')
  @ApiOkResponse({
    description:
      'Reverse geocode toạ độ -> địa chỉ (dùng chung bảng geocoding_cache, key REV:lat,lng)',
  })
  reverseGeocode(
    @CurrentOrgId() orgId: string,
    @CurrentUser() user: any,
    @Body() dto: ReverseGeocodeDto,
  ) {
    return this.service.reverseGeocode(orgId, user?.id ?? null, dto);
  }

  @Post('distance-matrix')
  @UseAudit({ entity: 'DistanceMatrixCache', action: AuditAction.Read })
  @Permissions('routes:read')
  @ApiOkResponse({
    description: 'Khoảng cách/thời gian từ fromKey -> toKey (có cache TTL)',
  })
  distanceMatrix(
    @CurrentOrgId() orgId: string,
    @CurrentUser() user: any,
    @Body() dto: DistanceMatrixDto,
  ) {
    return this.service.distanceMatrix(orgId, user?.id ?? null, dto);
  }
}
