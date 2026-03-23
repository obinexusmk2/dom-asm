import { HTMLToken, TokenizerError, TokenizerOptions } from './HTMLToken';
/**
 * Result of the tokenization process
 */
export interface TokenizerResult {
    tokens: HTMLToken[];
    errors: TokenizerError[];
}
/**
 * HTMLTokenizer
 *
 * Converts HTML string input into a stream of tokens that can be processed by a parser.
 * Handles various HTML elements including tags, attributes, text content, comments, etc.
 */
export declare class HTMLTokenizer {
    private _input;
    private _position;
    private _line;
    private _column;
    private _tokens;
    private _errors;
    private _options;
    private _tagStack;
    /**
     * Creates a new HTML tokenizer
     *
     * @param input - The HTML string to tokenize
     * @param options - Configuration options for the tokenizer
     */
    constructor(input: string, options?: TokenizerOptions);
    /**
     * Tokenizes the input HTML string
     *
     * @returns A result object containing tokens and any errors encountered
     */
    tokenize(): TokenizerResult;
    /**
     * Processes a tag (opening tag, closing tag, or special tag)
     */
    private processTag;
    /**
     * Processes text content
     */
    private processText;
    /**
     * Handles comment tokens
     */
    private handleComment;
    /**
     * Handles CDATA section tokens
     */
    private handleCDATA;
    /**
     * Handles DOCTYPE declaration tokens
     */
    private handleDoctype;
    /**
     * Reads attributes from a start tag
     *
     * @returns A map of attribute names to their values
     */
    private readAttributes;
    /**
     * Reads an attribute name
     *
     * @returns The attribute name or empty string if none found
     */
    private readAttributeName;
    /**
     * Reads an attribute value
     *
     * @returns The attribute value
     */
    private readAttributeValue;
    /**
     * Reads a tag name
     *
     * @returns The tag name or empty string if none found
     */
    private readTagName;
    /**
     * Checks if a tag is self-closing by HTML specification
     *
     * @param tagName - The tag name to check
     * @returns Whether the tag is self-closing
     */
    private isSelfClosingTag;
    /**
     * Skips to a specific character and advances past it
     *
     * @param char - The character to skip to
     */
    private skipUntil;
    /**
     * Reads until a predicate function returns true
     *
     * @param predicate - The function to test each character
     * @returns The read string
     */
    private readUntil;
    /**
     * Skips whitespace characters
     */
    private skipWhitespace;
    /**
     * Checks if a character is whitespace
     *
     * @param char - The character to check
     * @returns Whether the character is whitespace
     */
    private isWhitespace;
    /**
     * Checks if the input at current position matches a string
     *
     * @param str - The string to match
     * @param caseInsensitive - Whether to match case-insensitively
     * @returns Whether the string matches
     */
    private match;
    /**
     * Advances the position by a number of characters
     *
     * @param count - The number of characters to advance by (default: 1)
     * @returns The character at the previous position
     */
    private advance;
    /**
     * Reports an error during tokenization
     *
     * @param message - The error message
     * @param start - The start position of the error
     * @param end - The end position of the error
     * @param severity - The severity of the error
     */
    private reportError;
    /**
     * Checks if there are any unclosed tags
     *
     * @returns Whether there are unclosed tags
     */
    hasUnclosedTags(): boolean;
}
