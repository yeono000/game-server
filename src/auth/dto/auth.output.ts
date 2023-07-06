import { User } from 'src/user/user.entity';

export class AuthOutput {
  accessToken: string;
  user: User;
}
