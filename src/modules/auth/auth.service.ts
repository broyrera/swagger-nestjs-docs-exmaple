import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';

@Injectable()
export class AuthService {
  register(dto: RegisterRequestDto) {
    return {
      success: true,
      message: 'User registered successfully',
      data: {
        id: 'usr_123',
        name: dto.name,
        email: dto.email,
        role: 'USER',
      },
    };
  }

  login(dto: LoginRequestDto) {
    return {
      success: true,
      message: 'User logged in successfully',
      data: {
        accessToken: 'jwt-access-token',
        user: {
          id: 'usr_123',
          name: 'Suci Nurul Ilham',
          email: dto.email,
          role: 'USER',
        },
      },
    };
  }

  getMe() {
    return {
      success: true,
      message: 'Current user retrieved successfully',
      data: {
        id: 'usr_123',
        name: 'Suci Nurul Ilham',
        email: 'suci@example.com',
        role: 'USER',
      },
    };
  }
}
