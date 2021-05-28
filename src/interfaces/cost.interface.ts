import { Center } from './center.interface';

export interface Cost {
  id?: string;
  name: string;
  value: number;
  center?: Center;
}
