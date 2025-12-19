import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverExecutiveDto } from './create-driver-executive.dto';

export class UpdateDriverExecutiveDto extends PartialType(CreateDriverExecutiveDto) {}
