import { CurrentOrgId } from "@/common/decorators/current-org-id.decorator";
import { Roles } from "@/common/decorators/roles.decorator";
import { RolesGuard } from "@/common/guards/role.guard";
import { Controller, UseGuards, Get, Query, Post, Param, Body } from "@nestjs/common";
import { DriverExecutiveService } from "./driver-executive.service";
import { ArriveStopDto } from "./dto/arrive-stop.dto";
import { CodCollectDto } from "./dto/cod-collect.dto";
import { DoneStopDto } from "./dto/done-stop.dto";
import { FailStopDto } from "./dto/fail-stop.dto";
import { PodUploadDto } from "./dto/pod-upload.dto";
import { QueryTodayDto } from "./dto/query-today.dto";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { PermissionsGuard } from "@/common/guards/permissions.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('driver-app')
@UseGuards(RolesGuard)
@Roles('driver') // chỉ tài xế được gọi; nếu bạn muốn dispatcher test thì thêm 'dispatcher'
export class DriverExecutiveController {
  constructor(private readonly service: DriverExecutiveService) {}

  /** Danh sách shipment & stops trong ngày của tài xế */
  @Get('today')
  @Permissions('routes:read')
  async today(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Query() q: QueryTodayDto,
  ) {
    return this.service.listToday(orgId, userId, q);
  }

  /** Đánh dấu ARRIVE tại stop */
  @Post('stops/:id/arrive')
  async arrive(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Param('id') stopId: string,
    @Body() body: ArriveStopDto,
  ) {
    return this.service.arriveStop(orgId, userId, stopId, body);
  }

  /** Đánh dấu DONE tại stop (DELIVERY yêu cầu POD trước khi DONE – mặc định) */
  @Permissions('shipments:status')
  @Post('stops/:id/done')
  async done(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Param('id') stopId: string,
    @Body() body: DoneStopDto,
  ) {
    return this.service.doneStop(orgId, userId, stopId, body);
  }

  /** Đánh dấu FAILED tại stop */
  @Permissions('shipments:status')
  @Post('stops/:id/fail')
  async fail(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Param('id') stopId: string,
    @Body() body: FailStopDto,
  ) {
    return this.service.failStop(orgId, userId, stopId, body);
  }

  /** Upload POD (URL ảnh đã upload – tích hợp S3/MinIO ở tầng upload riêng) */
  @Permissions('shipments:update')
  @Post('stops/:id/pod')
  async pod(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Param('id') stopId: string,
    @Body() body: PodUploadDto,
  ) {
    return this.service.uploadPod(orgId, userId, stopId, body);
  }

  /** Thu COD tại stop (có thể gọi riêng hoặc gắn kèm DONE) */
  @Permissions('shipments:status')
  @Post('stops/:id/cod')
  async collectCod(
    @CurrentOrgId() orgId: string | null,
    @CurrentUser() userId: string,
    @Param('id') stopId: string,
    @Body() body: CodCollectDto,
  ) {
    return this.service.collectCod(orgId, userId, stopId, body);
  }
}
