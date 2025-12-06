import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateServiceLevelDto {
  @ApiProperty() @IsUUID() orgId!: string;

  @ApiProperty({ description: 'Unique code (UPPERCASE, digits, underscore)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9_]+$/)
  @MaxLength(60)
  code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;
}
