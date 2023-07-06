import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

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

  @Column({ default: null, nullable: true })
  deletedAt: Date;
}
