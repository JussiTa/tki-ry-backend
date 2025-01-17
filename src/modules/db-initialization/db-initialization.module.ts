import { Module } from '@nestjs/common';
import { DbInitializationService } from './db-initialization.service';
import { UsersModule } from 'src/modules/users/users.module';

Module({
  imports: [UsersModule],
  providers: [DbInitializationService],
  exports: [DbInitializationService],
});
export class DbInitializationModule {}
