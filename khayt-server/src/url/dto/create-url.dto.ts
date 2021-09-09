import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateUrlDto {
  @IsNotEmpty()
  longURL: string;
  @IsNotEmpty()
  isPasswordProtected: boolean;
  password: string;
  expireAt: Date;
  userId: User;
}
