import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigRefDto } from './create-region.dto.ts.js';

export class UpdateConfigRefDto extends PartialType(CreateConfigRefDto) {}
