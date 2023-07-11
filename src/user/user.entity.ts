import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { UserInput } from './dto/user.input';
import { Room } from '../room/room.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar' })
  username: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @ManyToOne(() => Room, (room) => room.players, { nullable: true })
  room: Room;

  @OneToOne(() => Room, (room) => room.host, { nullable: true })
  hostingRoom: Room;

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
