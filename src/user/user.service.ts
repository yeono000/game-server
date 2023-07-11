import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserInput } from './dto/user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      where: { deletedAt: null },
    });
  }

  async findUserById(id: number): Promise<User> {
    const answer = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.room', 'room')
      .where('user.id = :id', { id })
      .getOne();
    console.log(answer, id);
    return answer;
    // return await this.userRepository.findOne({ where: { id: id } });
  }

  async findUser(username: string): Promise<User> {
    const answer = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.room', 'room')
      .where('user.username = :username', { username })
      .getOne();
    console.log(answer, username);
    return answer;
    // return await this.userRepository.findOne({ where: { username: username } });
  }

  async create(user: UserInput): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (existUser) {
      throw new Error('Username is already exist');
    }
    return await this.userRepository.save({ createdAt: new Date(), ...user });
  }

  async update(id: number, user: User): Promise<User> {
    await this.userRepository.update(id, user);
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (user) {
      user.deletedAt = new Date();
      await this.userRepository.save(user);
    }
  }
}
