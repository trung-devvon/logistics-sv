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
  UseInterceptors,
} from '@nestjs/common';
import { HubsService } from './hubs.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { Roles } from '@/common/decorators/roles.decorator';

import { FilterHubDto } from './dto/filter-hub.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('hubs')
@ApiTags('Hubs')
@ApiBearerAuth('JWT-auth')
export class HubsController {
  constructor(private readonly hubsService: HubsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create a new hub' })
  @ApiResponse({ status: 201, description: 'The hub has been successfully created.' })
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
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000) // Cache 30 giây (override default)
  @ApiOperation({ summary: 'Retrieve all hubs with pagination and filter' })
  @ApiResponse({ status: 200, description: 'List of hubs with pagination metadata.' })
  findAll(@Query() query: FilterHubDto) {
    return this.hubsService.findAll(query);
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
  @ApiOperation({ summary: 'Retrieve a hub by ID' })
  @ApiResponse({ status: 200, description: 'Hub details' })
  findOne(@Param('id') id: string) {
    return this.hubsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HUB_MANAGER')
  @ApiOperation({ summary: 'Update a hub by ID' })
  @ApiResponse({ status: 200, description: 'The hub has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateHubDto: UpdateHubDto) {
    return this.hubsService.update(id, updateHubDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Delete a hub by ID' })
  @ApiResponse({ status: 200, description: 'The hub has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.hubsService.remove(id);
  }
}
