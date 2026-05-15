import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { autoIdExtension } from './auto-id.extension';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly base = new PrismaClient();
  readonly db = this.base.$extends(autoIdExtension);

  async onModuleInit() {
    await this.base.$connect();
    this.logger.log('Connected to database');
  }

  async onModuleDestroy() {
    await this.base.$disconnect();
  }
}
