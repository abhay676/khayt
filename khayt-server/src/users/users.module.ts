import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RabbitMQModule } from 'src/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RabbitMQModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
