import { CSSToken } from '../tokenization/CSSToken';
import { CSSAST } from '../ast/CSSAST';
import { CSSParserError } from './CSSParserError';
/**
 * Parser options
 */
export interface CSSParserOptions {
    errorRecovery?: boolean;
    preserveComments?: boolean;
    strict?: boolean;
}
/**
 * CSS Parser
 * Parses tokens into an AST
 */
export declare class CSSParser {
    /**
     * The tokens to parse
     */
    private tokens;
    /**
     * Current position in the token stream
     */
    private position;
    /**
     * Parser errors
     */
    errors: CSSParserError[];
    /**
     * Parser options
     */
    private options;
    /**
     * Creates a new CSS parser
     *
     * @param tokens - The tokens to parse
     * @param options - Parser options
     */
    constructor(tokens: CSSToken[], options?: CSSParserOptions);
    /**
     * Parses tokens into an AST
     *
     * @returns The parsed AST
     */
    parse(): CSSAST;
    /**
     * Parses the entire stylesheet
     *
     * @returns The parsed AST
     */
    private parseStylesheet;
    /**
     * Parses an at-rule
     *
     * @returns The parsed at-rule node
     */
    private parseAtRule;
    /**
     * Parses a CSS rule
     *
     * @returns The parsed rule node
     */
    private parseRule;
    /**
     * Parses a block of declarations
     *
     * @returns An array of declaration nodes
     */
    private parseBlock;
    /**
     * Parses declarations inside a block
     *
     * @returns An array of declaration nodes
     */
    private parseDeclarations;
    /**
     * Parses a single declaration
     *
     * @returns A declaration node
     */
    private parseDeclaration;
    /**
     * Skips whitespace tokens
     */
    private skipWhitespace;
    /**
     * Skips to the next semicolon (error recovery)
     */
    private skipToSemicolon;
    /**
     * Recovers from an error by skipping to the next rule
     */
    private recoverFromError;
    /**
     * Peeks at the current token
     *
     * @returns The current token or null
     */
    private peek;
    /**
     * Consumes the current token
     *
     * @returns The consumed token
     */
    private consume;
    /**
     * Adds a parser error
     *
     * @param message - The error message
     */
    private addError;
}
