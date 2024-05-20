import { Module } from '@nestjs/common';
import { AccessTokenWorkflow } from './access-token.workflow';
import { Sqlite3Module } from '../infra/adapters/sqlite3/sqlite3.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    Sqlite3Module,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('AUTH_JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AccessTokenWorkflow],
  exports: [AccessTokenWorkflow],
})
export class WorkflowsModule {}
