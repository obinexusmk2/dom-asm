import { HTMLToken } from '../tokenization/HTMLToken';
/**
 * Interface for HTML node structure
 */
export interface HTMLNode {
    type: string;
    name?: string;
    value?: string;
    attributes?: Map<string, string>;
    children: HTMLNode[];
    metadata: {
        equivalenceClass: number | null;
        isMinimized: boolean;
        commentCount?: number;
        textCount?: number;
        nodeCount?: number;
    };
}
/**
 * Interface for HTML AST structure
 */
export interface HTMLAst {
    root: HTMLNode;
    metadata: {
        minimizationMetrics?: {
            originalStateCount: number;
            minimizedStateCount: number;
            optimizationRatio: number;
        };
        [key: string]: any;
    };
}
/**
 * Interface for parser state
 */
interface ParserState {
    type: string;
    isAccepting: boolean;
    transitions: Map<string, ParserState>;
}
/**
 * Error class for HTML parsing errors
 */
export declare class HTMLParserError extends Error {
    readonly token: HTMLToken;
    readonly state: ParserState;
    readonly position: number;
    constructor(params: {
        message: string;
        token: HTMLToken;
        state: ParserState;
        position: number;
    });
}
/**
 * HTMLParser
 *
 * Parses HTML tokens into an Abstract Syntax Tree (AST) representation.
 * Implements automaton-based parsing with state minimization for optimization.
 */
export declare class HTMLParser {
    private states;
    private currentState;
    private equivalenceClasses;
    private optimizedStateMap;
    /**
     * Creates a new HTML parser
     */
    constructor();
    /**
     * Initializes the state machine for HTML parsing
     */
    private initializeStates;
    /**
     * Parses HTML input string into an AST
     *
     * @param input - The HTML string to parse
     * @returns The parsed HTML AST
     */
    parse(input: string): HTMLAst;
    /**
     * Minimizes the parser states using Hopcroft's algorithm
     */
    private minimizeStates;
    /**
     * Splits a block of states based on their transitions
     *
     * @param block - The block of states to split
     * @param partition - The current partition of states
     * @returns The split blocks
     */
    private splitBlock;
    /**
     * Creates a signature for a state based on its transitions
     *
     * @param state - The state to create a signature for
     * @param partition - The current partition of states
     * @returns A string signature uniquely identifying the state's behavior
     */
    private getStateSignature;
    /**
     * Builds an optimized AST from tokens using the minimized state machine
     *
     * @param tokens - The tokens to build the AST from
     * @returns The built HTML AST
     */
    private buildOptimizedAST;
    /**
     * Processes a token using the optimized state machine
     *
     * @param token - The token to process
     * @param currentNode - The current node being built
     * @param stack - The node stack for tracking nested elements
     * @returns The new current node
     */
    private processTokenWithOptimizedState;
    /**
     * Optimizes an AST by merging text nodes and removing redundant nodes
     *
     * @param ast - The AST to optimize
     * @returns The optimized AST
     */
    private optimizeAST;
    /**
     * Merges adjacent text nodes
     *
     * @param node - The node to process
     */
    private mergeTextNodes;
    /**
     * Removes redundant nodes like empty text nodes
     *
     * @param node - The node to process
     */
    private removeRedundantNodes;
    /**
     * Optimizes attributes by normalizing keys
     *
     * @param node - The node to process
     */
    private optimizeAttributes;
    /**
     * Gets the equivalence class for a state
     *
     * @param state - The state to get the equivalence class for
     * @returns The equivalence class ID
     */
    private getEquivalenceClass;
    /**
     * Handles a parser error
     *
     * @param error - The error to handle
     * @param currentNode - The current node when the error occurred
     */
    private handleParserError;
    /**
     * Computes metadata for an AST
     *
     * @param node - The root node
     * @returns The computed metadata
     */
    private computeOptimizedMetadata;
}
export {};
