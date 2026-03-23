import { State, StateMachine } from '../core/types';
import { createState } from './State';

/**
 * Creates a new StateMachine with an initial state.
 */
export function createStateMachine(initialStateId: string = 'initial'): StateMachine {
  const initialState = createState(initialStateId);
  const states = new Map<string, State>();
  states.set(initialStateId, initialState);

  return {
    states,
    initialState: initialStateId,
    currentState: initialStateId
  };
}

/**
 * Adds a state to the state machine.
 */
export function addState(machine: StateMachine, state: State): void {
  machine.states.set(state.id, state);
}

/**
 * Transitions the state machine to the next state based on the input symbol.
 * Returns true if the transition was successful, false otherwise.
 */
export function transition(machine: StateMachine, symbol: string): boolean {
  const current = machine.states.get(machine.currentState);
  if (!current) return false;

  const nextStateId = current.transitions.get(symbol);
  if (!nextStateId || !machine.states.has(nextStateId)) return false;

  machine.currentState = nextStateId;
  return true;
}

/**
 * Resets the state machine to its initial state.
 */
export function reset(machine: StateMachine): void {
  machine.currentState = machine.initialState;
}

/**
 * Checks if the state machine is currently in an accepting state.
 */
export function isAccepting(machine: StateMachine): boolean {
  const current = machine.states.get(machine.currentState);
  return current ? current.isAccepting : false;
}
