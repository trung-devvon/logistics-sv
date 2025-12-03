import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigRefDto } from './create-config-ref.dto';

export class UpdateConfigRefDto extends PartialType(CreateConfigRefDto) {}
