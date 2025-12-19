import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DriverExecutiveService } from './driver-executive.service';
import { CreateDriverExecutiveDto } from './dto/create-driver-executive.dto';
import { UpdateDriverExecutiveDto } from './dto/update-driver-executive.dto';

@Controller('driver-executive')
export class DriverExecutiveController {
  constructor(private readonly driverExecutiveService: DriverExecutiveService) {}

  @Post()
  create(@Body() createDriverExecutiveDto: CreateDriverExecutiveDto) {
    return this.driverExecutiveService.create(createDriverExecutiveDto);
  }

  @Get()
  findAll() {
    return this.driverExecutiveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverExecutiveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverExecutiveDto: UpdateDriverExecutiveDto) {
    return this.driverExecutiveService.update(+id, updateDriverExecutiveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverExecutiveService.remove(+id);
  }
}
