import { Module } from '@nestjs/common';

import { CustomerHttpModule } from './modules/lotlists-customers/customer-hhtp-module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/authentication/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PayTrailModule } from './modules/paytrail/paytrail.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/authentication/guards/jwt-auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import configuration, {
  DatabaseConfig,
  EnvironmentVariables,
} from './config/env/configuration';
import { Customer } from './modules/lotlists-customers/customer.entity';
import { LotList } from './modules/lotlists/lots.list.entity';
import { User } from './modules/users/users.entity';
import { AuthRefreshToken } from './modules/authentication/auth-refresh-token.entity';
import { DbInitializationModule } from './modules/db-initialization/db-initialization.module';
import { UsersModule } from './modules/users/users.module';
import { DbInitializationService } from './modules/db-initialization/db-initialization.service';
import { AuthorizationModule } from './modules/authorization/authorization.module';

@Module({
  imports: [
    AuthModule,
    AuthorizationModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const databaseConfig = configService.get<DatabaseConfig>('database');

        return {
          type: 'postgres',
          host: databaseConfig?.host,
          port: 5432,
          username: databaseConfig?.username,
          password: databaseConfig?.password,
          database: databaseConfig?.name,
          useUTC: databaseConfig?.timezone === 'UTC',
          //autoLoadEntities: Boolean(databaseConfig?.typeormSync),
          entities: [Customer, LotList, User, AuthRefreshToken],
          synchronize: Boolean(databaseConfig?.typeormSync),
        };
      },
    }),
    CustomerHttpModule,
    ScheduleModule.forRoot(),
    DbInitializationModule,
    PayTrailModule,

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 1000,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    DbInitializationService,
  ],
})
export class AppModule {}
