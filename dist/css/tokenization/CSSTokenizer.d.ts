import { CSSToken, Position } from './CSSToken';
/**
 * Options for CSS tokenization
 */
export interface TokenizerOptions {
    preserveWhitespace?: boolean;
    recognizeColors?: boolean;
    recognizeFunctions?: boolean;
    generateStateTransitions?: boolean;
}
/**
 * Tokenizer result
 */
export interface TokenizerResult {
    tokens: CSSToken[];
    errors: {
        message: string;
        position: Position;
    }[];
}
/**
 * CSS Tokenizer with support for state minimization
 * Breaks CSS into tokens that can be used for parsing and AST building
 */
export declare class CSSTokenizer {
    private input;
    private position;
    private line;
    private column;
    private tokens;
    private errors;
    private options;
    /**
     * Creates a new CSS tokenizer
     */
    constructor(input: string, options?: TokenizerOptions);
    /**
     * Tokenizes the input CSS string
     */
    tokenize(): TokenizerResult;
    /**
     * Tokenizes whitespace
     */
    private tokenizeWhitespace;
    /**
     * Tokenizes a comment
     */
    private tokenizeComment;
    /**
     * Tokenizes an at-keyword
     */
    private tokenizeAtKeyword;
    /**
     * Tokenizes a hash (id selector or color)
     */
    private tokenizeHash;
    /**
     * Tokenizes a number and optional unit
     */
    private tokenizeNumber;
    /**
     * Tokenizes a string
     */
    private tokenizeString;
    /**
     * Tokenizes an identifier (property, selector, or function)
     */
    private tokenizeIdentifier;
    /**
     * Tokenizes structural characters like {, }, :, ;, etc.
     */
    private tokenizeStructural;
    /**
     * Generates state transitions between tokens
     */
    private generateStateTransitions;
    /**
     * Computes equivalence classes for tokens
     */
    private computeEquivalenceClasses;
    /**
     * Helper method to check if a character is whitespace
     */
    private isWhitespace;
    /**
     * Helper method to check if a character is a digit
     */
    private isDigit;
    /**
     * Helper method to check if a character is a letter
     */
    private isLetter;
    /**
     * Helper method to check if a character can start an identifier
     */
    private isIdentStart;
    /**
     * Helper method to check if a character can be part of an identifier
     */
    private isIdentChar;
    /**
     * Helper method to check if a character can start a number
     */
    private isNumberStart;
    /**
     * Helper method to check if a character is a structural character
     */
    private isStructuralChar;
    /**
     * Helper method to check if a value is a valid color
     */
    private isValidColor;
    /**
     * Helper method to peek at a character
     */
    private peek;
    /**
     * Helper method to advance to the next character
     */
    private advance;
    /**
     * Helper method to get the current position
     */
    private getPosition;
    /**
     * Helper method to add an error
     */
    private addError;
}
