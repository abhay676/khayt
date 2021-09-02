import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false })
  longURL: string;
  @Column({ nullable: false })
  shortURL: string;
  @Column({ default: false })
  isFavourite: boolean;
  @Column({ default: false })
  isPasswordProtected: boolean;
  @Column({ nullable: true })
  expireAt: Date;
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
  @Column()
  @CreateDateColumn()
  createdAt: Date;
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
