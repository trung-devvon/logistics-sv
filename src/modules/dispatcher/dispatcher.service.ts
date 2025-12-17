import { Injectable } from '@nestjs/common';
import { CreateDispatcherDto } from './dto/board-query';
import { UpdateDispatcherDto } from './dto/dispatcher-manual.dto';

@Injectable()
export class DispatcherService {
  create(createDispatcherDto: CreateDispatcherDto) {
    return 'This action adds a new dispatcher';
  }

  findAll() {
    return `This action returns all dispatcher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dispatcher`;
  }

  update(id: number, updateDispatcherDto: UpdateDispatcherDto) {
    return `This action updates a #${id} dispatcher`;
  }

  remove(id: number) {
    return `This action removes a #${id} dispatcher`;
  }
}
