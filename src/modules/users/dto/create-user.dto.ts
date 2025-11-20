import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {

  @ApiProperty({ 
    example: 'John Doe',
    required: false 
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ 
    example: 'user@example.com',
    required: true,
    description: 'Email address of the user'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: '+84123456789',
    required: false,
    description: 'Phone number of the user'
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ 
    example: 'P@ssword1234',
    required: true,
    description: 'Password for the user account'
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
