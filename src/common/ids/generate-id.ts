import { nanoid } from 'nanoid';
import { IdPrefix } from './id-prefix';

export function generateId(prefix: IdPrefix): string {
  return `${prefix}_${nanoid(21)}`;
}
