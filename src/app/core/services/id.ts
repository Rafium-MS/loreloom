import { v4 as uuid } from 'uuid';

/**
 * Generate a unique identifier.
 */
export default function generateId(): string {
  return uuid();
}