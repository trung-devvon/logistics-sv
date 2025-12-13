import { Injectable } from '@nestjs/common';
import { CreateGeoDistanceDto } from './dto/create-geo-distance.dto';
import { UpdateGeoDistanceDto } from './dto/distance-matrix.dto';

@Injectable()
export class GeoDistanceService {
  create(createGeoDistanceDto: CreateGeoDistanceDto) {
    return 'This action adds a new geoDistance';
  }

  findAll() {
    return `This action returns all geoDistance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geoDistance`;
  }

  update(id: number, updateGeoDistanceDto: UpdateGeoDistanceDto) {
    return `This action updates a #${id} geoDistance`;
  }

  remove(id: number) {
    return `This action removes a #${id} geoDistance`;
  }
}
