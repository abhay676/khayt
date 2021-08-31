import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as JWT from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  async signUp(createUser: CreateUserDto) {
    // find user
    const isUserExists = await this.userService.findByEmail(createUser.email);

    if (isUserExists) {
      throw new BadRequestException('email already in use');
    }
    const user = this.userService.create(createUser);
    return user;
  }
  async singIn(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    // check password
    const isPwdMatch = await user.validatePassword(password);
    if (!isPwdMatch) throw new BadRequestException('password not match');
    return user;
  }
  async createUserVerifyToken(data: { email: string; id: string }) {
    const token = await JWT.sign(data, process.env.JWT_SECRET, {
      expiresIn: '300000', // 5 minutes
    });
    return token;
  }
  async verifyToken(userToken: string) {
    const isTokenVerified = await JWT.verify(userToken, process.env.JWT_SECRET);
    return isTokenVerified;
  }
}
