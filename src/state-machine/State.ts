import { State } from '../core/types';

/**
 * Creates a new State with the given parameters.
 */
export function createState(
  id: string,
  isAccepting: boolean = false,
  metadata?: Record<string, any>
): State {
  const state: State = {
    id,
    transitions: new Map<string, string>(),
    metadata: new Map<string, any>(),
    isAccepting
  };

  if (metadata) {
    for (const [key, value] of Object.entries(metadata)) {
      state.metadata.set(key, value);
    }
  }

  return state;
}

/**
 * Adds a transition from one state to another on a given symbol.
 */
export function addTransition(state: State, symbol: string, targetStateId: string): void {
  state.transitions.set(symbol, targetStateId);
}
