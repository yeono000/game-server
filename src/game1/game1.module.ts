import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game1Controller } from './game1.controller';
import { Game1 } from './game1.entity';
import { Game1Service } from './game1.service';
import { Room } from '../room/room.entity';
import { RoomService } from '../room/room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game1]),
    TypeOrmModule.forFeature([Room]),
  ],
  controllers: [Game1Controller],
  providers: [Game1Service, RoomService],
})
export class Game1Module {}
