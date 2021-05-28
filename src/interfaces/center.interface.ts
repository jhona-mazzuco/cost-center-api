import { User } from './user.interface';
import { Cost } from './cost.interface';

export interface Center {
  id?: string;
  name: string;
  user?: User;
  costs?: Cost[];
}
