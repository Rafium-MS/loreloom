/**
 * Minimal helper types for state selectors.
 */
export interface RootState {
  [key: string]: unknown;
}

export type Selector<T> = (state: RootState) => T;

/**
 * Identity wrapper to create a selector.
 */
export function createSelector<T>(selector: Selector<T>): Selector<T> {
  return selector;
}