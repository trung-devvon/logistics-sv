import { Injectable } from '@nestjs/common';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';

@Injectable()
export class HubsService {
  create(createHubDto: CreateHubDto) {
    return 'This action adds a new hub';
  }

  findAll() {
    return `This action returns all hubs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hub`;
  }

  update(id: number, updateHubDto: UpdateHubDto) {
    return `This action updates a #${id} hub`;
  }

  remove(id: number) {
    return `This action removes a #${id} hub`;
  }
}
