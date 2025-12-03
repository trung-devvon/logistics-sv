import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignMemberDto {
  @ApiProperty()
  @IsUUID()
  userId!: string;
}
