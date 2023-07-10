import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from '../constants';
import { RoomInput } from './dto/room.input';
import { RoomService } from './room.service';
import { Room } from './room.entity';

@Controller('room')
@ApiTags('Room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Room> {
    return this.roomService.findRoomById(id);
  }

  @Post()
  @Public()
  @ApiBody({ type: RoomInput })
  async create(@Body() Room: RoomInput): Promise<Room> {
    return this.roomService.create(Room);
  }

  @Put(':id')
  @ApiBody({ type: RoomInput })
  async update(
    @Param('id') id: number,
    @Body() Room: RoomInput,
  ): Promise<Room> {
    return this.roomService.update(id, Room);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.roomService.delete(id);
  }
}
