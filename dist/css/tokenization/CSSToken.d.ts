import { TokenType } from './CSSTokenType';
/**
 * Position information for tokens
 */
export interface Position {
    line: number;
    column: number;
    offset?: number;
}
/**
 * Metadata for tokens including state minimization information
 */
export interface TokenMetadata {
    stateSignature?: string;
    equivalenceClass?: number | null;
    transitions?: Map<string, CSSToken>;
    [key: string]: any;
}
/**
 * CSS Token with support for state minimization
 */
export declare class CSSToken {
    readonly type: TokenType;
    readonly value: string | number;
    readonly position: Position;
    readonly metadata: TokenMetadata;
    /**
     * Creates a new CSS token with state minimization capabilities
     */
    constructor(type: TokenType, value: string | number, position: Position, metadata?: TokenMetadata);
    /**
     * Validates the token type
     */
    private validateType;
    /**
     * Validates the position information
     */
    private validatePosition;
    /**
     * Computes a state signature for this token based on its transitions
     * Used for state minimization
     */
    computeStateSignature(): string;
    /**
     * Gets a signature for transitions
     */
    private getTransitionsSignature;
    /**
     * Gets a signature for metadata
     */
    private getMetadataSignature;
    /**
     * Adds a transition to the token and returns a new token
     */
    addTransition(symbol: string, targetToken: CSSToken): CSSToken;
    /**
     * Sets an equivalence class for the token and returns a new token
     */
    setEquivalenceClass(classId: number): CSSToken;
    /**
     * Checks if this token equals another token
     */
    equals(other: CSSToken): boolean;
    /**
     * Checks if this token is of any of the specified types
     */
    isTypeOf(...types: TokenType[]): boolean;
    /**
     * Returns a string representation of this token
     */
    toString(): string;
    /**
     * Factory method for creating an EOF token
     */
    static createEOF(position: Position): CSSToken;
    /**
     * Factory method for creating an error token
     */
    static createError(message: string, position: Position): CSSToken;
    /**
     * Factory method for creating a whitespace token
     */
    static createWhitespace(value: string, position: Position): CSSToken;
    /**
     * Checks if two tokens are equivalent for state minimization
     */
    static areEquivalent(token1: CSSToken, token2: CSSToken): boolean;
    /**
     * Computes equivalence classes for a set of tokens
     * This is a key part of the state minimization algorithm
     */
    static computeEquivalenceClasses(tokens: CSSToken[]): Map<number, CSSToken[]>;
}
