import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation
} from '@nestjs/swagger';


@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('register')
  @ApiOperation({ summary: 'Register new user (Admin/Manager only)' })
  @ApiCreatedResponse({ 
  description: 'User registered successfully'
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin/Manager only' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return {
      message: 'User created successfully',
      data: user,
    };
  }
}
