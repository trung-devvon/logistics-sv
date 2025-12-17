import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { CreateDispatcherDto } from './dto/board-query';
import { UpdateDispatcherDto } from './dto/dispatcher-manual.dto';

@Controller('dispatcher')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @Post()
  create(@Body() createDispatcherDto: CreateDispatcherDto) {
    return this.dispatcherService.create(createDispatcherDto);
  }

  @Get()
  findAll() {
    return this.dispatcherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dispatcherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDispatcherDto: UpdateDispatcherDto) {
    return this.dispatcherService.update(+id, updateDispatcherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dispatcherService.remove(+id);
  }
}
