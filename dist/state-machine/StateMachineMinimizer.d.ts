import { StateMachine } from '../core/types';
/**
 * StateMachineMinimizer
 * Class that implements automaton state minimization algorithms to reduce
 * the size and complexity of state machines while preserving their behavior.
 */
export declare class StateMachineMinimizer {
    /**
     * Minimizes a state machine by identifying and merging equivalent states.
     * Uses Hopcroft's algorithm for DFA minimization.
     *
     * @param stateMachine - The state machine to minimize
     * @returns A new minimized state machine with equivalent behavior
     */
    minimize(stateMachine: StateMachine): StateMachine;
    /**
     * Builds equivalence classes of states based on their distinguishability.
     * Starts with two classes: accepting and non-accepting states.
     * Then refines until no more refinements are possible.
     *
     * @param states - The states to partition into equivalence classes
     * @returns A map where keys are signatures and values are arrays of equivalent states
     */
    private buildEquivalenceClasses;
    /**
     * Splits a block of states into smaller blocks if they are distinguishable.
     * Two states are distinguishable if they transition to states in different blocks
     * for at least one input symbol.
     *
     * @param block - The block of states to potentially split
     * @param partition - The current partition of all states
     * @returns An array of blocks (potentially just the original if no split needed)
     */
    private splitBlock;
    /**
     * Gets a signature for a state based on its transitions relative to the current partition.
     *
     * @param state - The state to get a signature for
     * @param partition - The current partition of all states
     * @returns A string signature that identifies the state's transition behavior
     */
    private getStateSignature;
    /**
     * Gets a signature for a block of states.
     *
     * @param block - The block of states
     * @param partition - The current partition of all states
     * @returns A string signature for the block
     */
    private getBlockSignature;
    /**
     * Merges equivalent states to create a minimized state machine.
     *
     * @param equivalenceClasses - The map of equivalence classes
     * @returns A new state machine with merged states
     */
    private mergeEquivalentStates;
    /**
     * Optimizes the transitions of the minimized state machine by removing redundant
     * transitions and normalizing transition symbols.
     *
     * @param minimizedMachine - The state machine to optimize
     * @returns The optimized state machine
     */
    private optimizeTransitions;
    /**
     * Determines if a set of symbols can be combined into a character class.
     *
     * @param symbols - The symbols to check
     * @returns Whether the symbols can be combined
     */
    private canCombineSymbols;
    /**
     * Combines a set of symbols into a character class.
     *
     * @param symbols - The symbols to combine
     * @returns A combined character class
     */
    private combineSymbols;
}
