import { State } from '../core/types';
/**
 * Creates a new State with the given parameters.
 */
export declare function createState(id: string, isAccepting?: boolean, metadata?: Record<string, any>): State;
/**
 * Adds a transition from one state to another on a given symbol.
 */
export declare function addTransition(state: State, symbol: string, targetStateId: string): void;
