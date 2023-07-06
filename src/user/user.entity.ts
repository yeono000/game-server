import { RefreshToken } from 'src/auth/refreshToken.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserInput } from './dto/user.input';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar' })
  username: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'varchar', default: 'example@gmail.com' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  profileImage: string;

  @Column({ nullable: false, type: 'varchar', default: 'user' })
  type: 'user' | 'admin';

  @CreateDateColumn({ type: 'timestamp' })
  @Column({ default: null, nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Column({ default: null, nullable: true })
  updatedAt: Date;

  @Column({ default: null, nullable: true })
  deletedAt: Date;
}
