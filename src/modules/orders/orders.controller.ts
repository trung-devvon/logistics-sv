import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-status.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AuditLogInterceptor } from '@/common/interceptors/audit.interceptor';
import { OrderService } from './orders.service';
import { UseAudit } from '@/common/decorators/audit.decorator';
import { AuditAction } from '@/common/types/audit.types';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(AuditLogInterceptor)
@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MERCHANT', 'DISPATCHER')
  @Permissions('shipments:create')
  @UseAudit({ entity: 'Order', action: AuditAction.Create })
  @ApiOkResponse({ description: 'Create order' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: any) {
    // this.policy.canCreate(user);
    return this.service.create(dto, user.id);
  }

  @Get(':id')
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'MERCHANT',
    'DISPATCHER',
    'COURIER',
    'WAREHOUSE_STAFF',
    'CUSTOMER_SERVICE',
  )
  @Permissions('shipments:read')
  @ApiOkResponse({ description: 'Get order by id' })
  async getById(@Param('id') id: string, @CurrentUser() user: any) {
    const order = await this.service.getById(id, user.id);
    // this.policy.canRead(user, /* order */);
    return order;
  }

  @Get()
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'MERCHANT',
    'DISPATCHER',
    'COURIER',
    'WAREHOUSE_STAFF',
    'CUSTOMER_SERVICE',
  )
  @Permissions('shipments:read')
  @ApiOkResponse({ description: 'Search orders' })
  search(@Query() q: QueryOrderDto, @CurrentUser() user: any) {
    // this.policy.canRead(user);
    const { sort, skip, take, createdFrom, createdTo, status, ...rest } = q;
    return this.service.search({
      ...rest,
      status,
      sort,
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      createdFrom,
      createdTo,
    });
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MERCHANT')
  @Permissions('shipments:update')
  @UseAudit({ entity: 'Order', action: AuditAction.Update })
  @ApiOkResponse({ description: 'Update order data' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @CurrentUser() user: any,
  ) {
    // this.policy.canUpdate(user);
    return this.service.update(id, dto, user.id);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'DISPATCHER')
  @Permissions('shipments:status')
  @UseAudit({ entity: 'Order', action: AuditAction.Update })
  @ApiOkResponse({ description: 'Change order status' })
  changeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: any,
  ) {
    // this.policy.canChangeStatus(user);
    return this.service.changeStatus(id, dto, user.id);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Permissions('shipments:delete')
  @UseAudit({ entity: 'Order', action: AuditAction.Delete })
  @ApiOkResponse({ description: 'Delete order' })
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    // this.policy.canDelete(user);
    return this.service.delete(id);
  }

  @Get(':id/history')
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'MERCHANT',
    'DISPATCHER',
    'CUSTOMER_SERVICE',
  )
  @Permissions('shipments:read')
  @ApiOkResponse({ description: 'Order history' })
  history(@Param('id') id: string, @CurrentUser() user: any) {
    // this.policy.canRead(user);
    return this.service.history(id);
  }
}
