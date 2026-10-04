import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  // Registers the User repository for dependency injection.
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // AuthModule uses this service to link Supabase identities to local users.
  exports: [UsersService],
})
export class UsersModule {}
