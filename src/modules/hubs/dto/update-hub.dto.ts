import { PartialType } from '@nestjs/swagger';
import { CreateHubDto } from './create-hub.dto';

export class UpdateHubDto extends PartialType(CreateHubDto) {}
