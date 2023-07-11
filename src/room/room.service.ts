import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { RoomInput } from './dto/room.input';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async findAll(): Promise<Room[]> {
    const answer = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.host', 'host')
      .leftJoinAndSelect('room.players', 'players')
      .leftJoinAndSelect('room.game', 'game')
      .where('room.deletedAt IS NULL')
      .getMany();
    return answer;
  }

  async findRoomById(id: number): Promise<Room> {
    const answer = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.host', 'host')
      .leftJoinAndSelect('room.players', 'players')
      .leftJoinAndSelect('room.game', 'game')
      .where('room.id = :id', { id })
      .getOne();
    console.log(answer, id);
    return answer;
  }

  async findRoom(roomName: string): Promise<Room> {
    const answer = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.host', 'host')
      .leftJoinAndSelect('room.players', 'players')
      .leftJoinAndSelect('room.game', 'game')
      .where('room.roomName LIKE :roomName', { roomName: `%${roomName}%` })
      .getOne();
    return answer;
  }

  async create(room: RoomInput): Promise<Room> {
    console.log(room + 'im in room service');
    return await this.roomRepository.save({ createdAt: new Date(), ...room });
  }

  async update(id: number, room: RoomInput): Promise<Room> {
    await this.roomRepository.update(id, room);
    return await this.roomRepository.findOne({ where: { id: id } });
  }

  async delete(id: number): Promise<void> {
    const room = await this.roomRepository.findOne({ where: { id: id } });
    if (room) {
      room.deletedAt = new Date();
      await this.roomRepository.save(room);
    }
  }
}
