import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, nullable: false })
  username: string;
  @Column({ nullable: false })
  password: string;
  @Column({ nullable: false })
  salt: string;
  @Column({ unique: true, nullable: false })
  email: string;
  @Column({ nullable: false, default: false })
  isEmailVerified: boolean;
  @Column({ nullable: false })
  name: string;
  @Column()
  @CreateDateColumn()
  createdAt: Date;
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, this.salt);
  }
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
