import { PartialType } from '@nestjs/swagger';
import { CreateDriverDto } from './create-driver.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateDriverDto extends PartialType(
    OmitType(CreateDriverDto, ['userId'] as const)
) { }
