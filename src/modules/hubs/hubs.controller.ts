import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { HubsService } from './hubs.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Hubs')
@ApiBearerAuth('JWT-auth')
@Controller('hubs')
export class HubsController {
  constructor(private readonly hubsService: HubsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Tạo Hub/Kho mới' })
  @ApiCreatedResponse({ description: 'Tạo thành công' })
  create(@Body() createHubDto: CreateHubDto) {
    return this.hubsService.create(createHubDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'HUB_MANAGER',
    'DISPATCHER',
    'SORTER',
    'COURIER',
  )
  @ApiOperation({ summary: 'Lấy danh sách Hub' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Lọc theo Org ID' })
  @ApiOkResponse({ description: 'Danh sách Hub' })
  findAll(@Query('orgId') orgId?: string) {
    return this.hubsService.findAll(orgId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'HUB_MANAGER',
    'DISPATCHER',
    'SORTER',
    'COURIER',
  )
  @ApiOperation({ summary: 'Lấy chi tiết Hub' })
  @ApiOkResponse({ description: 'Chi tiết Hub' })
  findOne(@Param('id') id: string) {
    return this.hubsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HUB_MANAGER')
  @ApiOperation({ summary: 'Cập nhật Hub' })
  @ApiOkResponse({ description: 'Cập nhật thành công' })
  update(@Param('id') id: string, @Body() updateHubDto: UpdateHubDto) {
    return this.hubsService.update(id, updateHubDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Xóa Hub' })
  @ApiOkResponse({ description: 'Xóa thành công' })
  remove(@Param('id') id: string) {
    return this.hubsService.remove(id);
  }
}
