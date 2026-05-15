import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetCurrentUserApiDocs,
  LoginApiDocs,
  RegisterApiDocs,
} from './docs/auth.swagger';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @RegisterApiDocs()
  register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @LoginApiDocs()
  login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @GetCurrentUserApiDocs()
  getMe() {
    return this.authService.getMe();
  }
}
