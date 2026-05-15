import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '../../common/auth/jwt-payload.type';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterRequestDto) {
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    try {
      const user = await this.prisma.db.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash,
        },
      });
      return {
        success: true,
        message: 'User registered successfully',
        data: this.toProfile(user),
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException({
          success: false,
          message: 'Email already exists',
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            details: [{ field: 'email', message: 'Email already exists' }],
          },
        });
      }
      throw err;
    }
  }

  async login(dto: LoginRequestDto) {
    const user = await this.prisma.db.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid email or password',
        error: { code: 'INVALID_CREDENTIALS', details: [] },
      });
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      success: true,
      message: 'User logged in successfully',
      data: {
        accessToken,
        user: this.toProfile(user),
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authentication is required or token is invalid',
        error: { code: 'INVALID_TOKEN', details: [] },
      });
    }
    return {
      success: true,
      message: 'Current user retrieved successfully',
      data: this.toProfile(user),
    };
  }

  private toProfile(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
