import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { FilterDriverDto } from './dto/filter-driver.dto';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('drivers')
@ApiTags('Drivers')
@ApiBearerAuth('JWT-auth')
export class DriversController {
  constructor(private readonly driversService: DriversService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Permissions('drivers:create')
  @ApiOperation({ summary: 'Create a new driver from existing user' })
  @ApiResponse({ status: 201, description: 'Driver created successfully.' })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HUB_MANAGER', 'DISPATCHER')
  @Permissions('drivers:read')
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ status: 200, description: 'List of drivers.' })
  findAll(@Query() query: FilterDriverDto) {
    return this.driversService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HUB_MANAGER', 'DISPATCHER')
  @Permissions('drivers:read')
  @ApiOperation({ summary: 'Get a driver by ID' })
  @ApiResponse({ status: 200, description: 'Driver retrieved successfully.' })
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Permissions('drivers:update')
  @ApiOperation({ summary: 'Update a driver by ID' })
  @ApiResponse({ status: 200, description: 'Driver updated successfully.' })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Permissions('drivers:delete')
  @ApiOperation({ summary: 'Delete a driver by ID' })
  @ApiResponse({ status: 200, description: 'Driver deleted successfully.' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.driversService.remove(id);
  }
}
