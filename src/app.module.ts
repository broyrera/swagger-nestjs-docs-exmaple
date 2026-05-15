import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { MatchesModule } from './modules/matches/matches.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ParticipantsModule } from './modules/participants/participants.module';

@Module({
  imports: [
    AuthModule,
    OrganizationsModule,
    CompetitionsModule,
    ParticipantsModule,
    MatchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
