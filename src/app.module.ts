import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';

@Module({
  imports: [AuthModule, OrganizationsModule, CompetitionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
