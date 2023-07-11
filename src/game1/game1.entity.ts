import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';

@Entity()
export class Game1 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'integer', default: 31 })
  count: number;

  @JoinColumn()
  @ManyToOne(() => Room, (room) => room.game, { nullable: false })
  room: Room;

  @Column({ nullable: false, type: 'integer', default: 0 })
  now: number;

  @Column({ nullable: false, type: 'integer', default: 0 })
  playerNum: number;

  @Column({ nullable: false, type: 'varchar', default: '[]' })
  index: string;

  @Column({ nullable: false, type: 'varchar', default: '[]' })
  gameOverUser: string;

  @Column({ nullable: false, type: 'varchar', default: 'ready' })
  state: 'ready' | 'onGame' | 'end';
}
