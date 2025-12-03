import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigRefService } from './config-ref.service';
import { CreateConfigRefDto } from './dto/create-config-ref.dto';
import { UpdateConfigRefDto } from './dto/update-config-ref.dto';

@Controller('config-ref')
export class ConfigRefController {
  constructor(private readonly configRefService: ConfigRefService) {}

  @Post()
  create(@Body() createConfigRefDto: CreateConfigRefDto) {
    return this.configRefService.create(createConfigRefDto);
  }

  @Get()
  findAll() {
    return this.configRefService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configRefService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigRefDto: UpdateConfigRefDto) {
    return this.configRefService.update(+id, updateConfigRefDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configRefService.remove(+id);
  }
}
