import { State, StateMachine } from '../core/types';
/**
 * Creates a new StateMachine with an initial state.
 */
export declare function createStateMachine(initialStateId?: string): StateMachine;
/**
 * Adds a state to the state machine.
 */
export declare function addState(machine: StateMachine, state: State): void;
/**
 * Transitions the state machine to the next state based on the input symbol.
 * Returns true if the transition was successful, false otherwise.
 */
export declare function transition(machine: StateMachine, symbol: string): boolean;
/**
 * Resets the state machine to its initial state.
 */
export declare function reset(machine: StateMachine): void;
/**
 * Checks if the state machine is currently in an accepting state.
 */
export declare function isAccepting(machine: StateMachine): boolean;
