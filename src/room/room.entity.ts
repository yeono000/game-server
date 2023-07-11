import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Game1 } from '../game1/game1.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar' })
  roomName: string;

  @OneToOne(() => User, (user) => user.hostingRoom)
  @JoinColumn()
  host: User;

  @JoinColumn()
  @OneToMany(() => User, (user) => user.room)
  players: User[];

  @Column({ nullable: true, type: 'varchar' })
  profileImage: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Column({ default: null, nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Column({ default: null, nullable: true })
  updatedAt: Date;

  @OneToMany(() => Game1, (game) => game.room, { nullable: true })
  @JoinColumn()
  game: Game1[];

  @Column({ default: null, nullable: true })
  deletedAt: Date;
}
