import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';

@Module({
  imports: [AuthModule, OrganizationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
