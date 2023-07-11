import { User } from '../../user/user.entity';

export class AuthOutput {
  accessToken: string;
  user: User;
}
