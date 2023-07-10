import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/user.entity';

export class RoomInput {
  @ApiProperty({ type: String, description: '방 이름' })
  roomName: string;
  @ApiProperty({ type: String, description: '호스트' })
  host: User;
  @ApiProperty({ description: '플레이어' })
  players: User[];
}
