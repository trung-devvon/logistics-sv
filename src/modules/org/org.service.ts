import { Injectable } from '@nestjs/common';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';

@Injectable()
export class OrgService {
  create(createOrgDto: CreateOrgDto) {
    return 'This action adds a new org';
  }

  findAll() {
    return `This action returns all org`;
  }

  findOne(id: number) {
    return `This action returns a #${id} org`;
  }

  update(id: number, updateOrgDto: UpdateOrgDto) {
    return `This action updates a #${id} org`;
  }

  remove(id: number) {
    return `This action removes a #${id} org`;
  }
}
