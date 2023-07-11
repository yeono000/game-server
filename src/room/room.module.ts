import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room } from './room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { Game1Service } from '../game1/game1.service';
import { Game1 } from '../game1/game1.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Game1]),
    UserModule,
  ],
  controllers: [RoomController],
  providers: [RoomGateway, RoomService, UserService, Game1Service],
})
export class RoomModule {}
