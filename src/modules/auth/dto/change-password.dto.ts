import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Old password must not be empty' })
  @ApiProperty({ description: 'Old password', example: 'YourOldPassword123' })
  oldPassword: string;

  @ApiProperty({ description: 'New password', example: 'YourNewPassword123' })
  @IsString()
  @IsNotEmpty({ message: 'New password must not be empty' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}