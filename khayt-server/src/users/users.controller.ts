import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from './auth.service';
import { RabbitMQService } from 'src/rabbitmq.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Post('/sign-up')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signUp(createUserDto);
    // generate Verification token
    const token = await this.authService.createUserVerifyToken({
      email: user.email,
      id: user.id,
    });
    const content = {
      mailContent: token,
      type: 'verify',
      email: user.email,
    };
    const queuePattern = 'queue';
    // push to Queue
    this.rabbitMQService.send(queuePattern, content);
    return user;
  }

  @Post('/login')
  login(@Body() data: { email: string; password: string }) {
    return this.authService.singIn(data.email, data.password);
  }

  @Get('/verify')
  async verifyUser(@Query() query) {
    const queuePattern = 'queue';
    const token = query.token;
    const [isUserVerified, userEmail, userName] =
      await this.authService.verifyToken(token);

    if (isUserVerified) {
      const content = {
        type: 'welcome',
        email: userEmail,
        mailContent: userName,
      };
      this.rabbitMQService.send(queuePattern, content);
    }
    return {
      success: true,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
