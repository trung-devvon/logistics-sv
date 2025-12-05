import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HubsService } from './hubs.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';

@Controller('hubs')
export class HubsController {
  constructor(private readonly hubsService: HubsService) {}

  @Post()
  create(@Body() createHubDto: CreateHubDto) {
    return this.hubsService.create(createHubDto);
  }

  @Get()
  findAll() {
    return this.hubsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hubsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHubDto: UpdateHubDto) {
    return this.hubsService.update(+id, updateHubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hubsService.remove(+id);
  }
}
