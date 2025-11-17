import { 
  Controller, 
  Post, 
  UseGuards, 
  Request, 
  HttpCode, 
  HttpStatus, 
  Body
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    const data = await this.authService.login(req.user);

    return {
      message: 'Đăng nhập thành công',
      data: data,
    };
  }
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-tokens')
  async refreshTokens(@Request() req: any) {
    const { id, refreshTokenId } = req.user; 
    
    const data = await this.authService.refreshTokens(id, refreshTokenId);  

    return {
      message: 'Làm mới token thành công',
      data,
    }
  }


}
