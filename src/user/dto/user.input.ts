import { ApiProperty } from '@nestjs/swagger';

export class UserInput {
  @ApiProperty({ type: String, description: '유저 ID' })
  username: string;
  @ApiProperty({ type: String, description: '비밀번호' })
  password: string;
  @ApiProperty({ type: String, description: '유저명' })
  name: string;
  @ApiProperty({ type: String, description: '이메일' })
  email: string;
  @ApiProperty({ type: String, description: '프로필 이미지' })
  profileImage: string;
}
