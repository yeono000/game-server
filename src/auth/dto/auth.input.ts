import { ApiProperty } from '@nestjs/swagger';

export class AuthInput {
  @ApiProperty({ type: String, description: '유저 ID' })
  username: string;

  @ApiProperty({ type: String, description: 'password' })
  password: string;
}
