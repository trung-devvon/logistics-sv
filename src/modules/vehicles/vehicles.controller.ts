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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Vehicles')
@ApiBearerAuth('JWT-auth')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Tạo xe mới' })
  @ApiCreatedResponse({ description: 'Tạo xe thành công' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
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
  @ApiOperation({ summary: 'Get List Vehicle (pag & filter)' })
  @ApiOkResponse({ description: 'Danh sách xe' })
  findAll(@Query() query: FilterVehicleDto) {
    return this.vehiclesService.findAll(query);
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
  @ApiOperation({ summary: 'Lấy chi tiết xe' })
  @ApiOkResponse({ description: 'Chi tiết xe' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Cập nhật xe' })
  @ApiOkResponse({ description: 'Cập nhật thành công' })
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Xóa xe' })
  @ApiOkResponse({ description: 'Xóa thành công' })
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
