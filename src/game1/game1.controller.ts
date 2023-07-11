import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Game1Service } from './game1.service';
import { Game1 } from './game1.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from '../constants';
import { RoomService } from '../room/room.service';

@Controller('game1')
@ApiTags('Game1')
export class Game1Controller {
  constructor(
    private readonly game1Service: Game1Service,
    private readonly roomService: RoomService,
  ) {}

  @Get()
  async findAll(): Promise<Game1[]> {
    return this.game1Service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Game1> {
    return this.game1Service.findgame1ById(id);
  }

  @Post(':roomId')
  @Public()
  async create(@Param('roomId') id: number): Promise<Game1> {
    const room = await this.roomService.findRoomById(id);
    console.log(room);
    return this.game1Service.create(room);
  }

  @Put(':id')
  @ApiBody({ type: Game1 })
  async update(@Param('id') id: number, @Body() game1: Game1): Promise<Game1> {
    return this.game1Service.update(id, game1);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.game1Service.delete(id);
  }
}
