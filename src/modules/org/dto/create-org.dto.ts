import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class CreateOrgDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    description: 'Unique code, uppercase letters/digits/underscore',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9_]+$/)
  @MaxLength(60)
  code!: string;
}
