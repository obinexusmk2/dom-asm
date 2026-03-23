import { CSSToken, Position } from '../tokenization/CSSToken';
/**
 * CSS Parser Error
 * Represents an error that occurred during parsing
 */
export declare class CSSParserError extends Error {
    /**
     * The position where the error occurred
     */
    readonly position: Position;
    /**
     * The token that caused the error
     */
    readonly token: CSSToken | null;
    /**
     * Creates a new parser error
     *
     * @param message - The error message
     * @param position - The position where the error occurred
     * @param token - The token that caused the error
     */
    constructor(message: string, position: Position, token?: CSSToken | null);
    /**
     * Creates a string representation of the error
     *
     * @returns A string representation
     */
    toString(): string;
}
