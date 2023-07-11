import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game1 } from './game1.entity';
import * as random from 'shuffle-array';
import { Room } from '../room/room.entity';

@Injectable()
export class Game1Service {
  constructor(
    @InjectRepository(Game1)
    private game1Repository: Repository<Game1>,
  ) {}

  async findAll(): Promise<Game1[]> {
    return await this.game1Repository.find();
  }

  async findgame1ById(id: number): Promise<Game1> {
    return await this.game1Repository.findOne({ where: { id: id } });
  }

  // async findgame1(game1name: string): Promise<Game1> {
  //   return await this.game1Repository.findOne({ where: { game1name: game1name } });
  // }

  async create(room: Room): Promise<Game1> {
    return await this.game1Repository.save({
      room: room,
      index: JSON.stringify(
        room.players.map((player) => player.id).sort(() => Math.random() - 0.5),
      ),
      playerNum: room.players.length,
      state: 'onGame',
      gameOverUser: '[]',
    });
  }

  async update(id: number, game: Game1): Promise<Game1> {
    await this.game1Repository.update(id, game);
    return await this.game1Repository.findOne({ where: { id: id } });
  }

  async delete(id: number): Promise<void> {
    const game1 = await this.game1Repository.findOne({ where: { id: id } });
    await this.game1Repository.remove(game1);
  }
}
