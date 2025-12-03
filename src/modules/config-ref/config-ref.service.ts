import { Injectable } from '@nestjs/common';
import { CreateConfigRefDto } from './dto/create-config-ref.dto';
import { UpdateConfigRefDto } from './dto/update-config-ref.dto';

@Injectable()
export class ConfigRefService {
  create(createConfigRefDto: CreateConfigRefDto) {
    return 'This action adds a new configRef';
  }

  findAll() {
    return `This action returns all configRef`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configRef`;
  }

  update(id: number, updateConfigRefDto: UpdateConfigRefDto) {
    return `This action updates a #${id} configRef`;
  }

  remove(id: number) {
    return `This action removes a #${id} configRef`;
  }
}
