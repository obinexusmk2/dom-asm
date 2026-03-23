/**
 * Enum-like object defining HTML token types
 */
export declare const HTMLTokenType: {
    readonly StartTag: "StartTag";
    readonly EndTag: "EndTag";
    readonly Text: "Text";
    readonly Comment: "Comment";
    readonly ConditionalComment: "ConditionalComment";
    readonly Doctype: "Doctype";
    readonly CDATA: "CDATA";
    readonly EOF: "EOF";
};
export declare type TokenType = typeof HTMLTokenType[keyof typeof HTMLTokenType];
/**
 * Base token interface with common properties
 */
export interface BaseToken {
    type: TokenType;
    start: number;
    end: number;
    line: number;
    column: number;
}
/**
 * StartTag token with attributes
 */
export interface StartTagToken extends BaseToken {
    type: 'StartTag';
    name: string;
    attributes: Map<string, string>;
    selfClosing: boolean;
    namespace?: string;
}
/**
 * EndTag token
 */
export interface EndTagToken extends BaseToken {
    type: 'EndTag';
    name: string;
    namespace?: string;
}
/**
 * Text content token
 */
export interface TextToken extends BaseToken {
    type: 'Text';
    content: string;
    isWhitespace: boolean;
}
/**
 * Comment token
 */
export interface CommentToken extends BaseToken {
    type: 'Comment';
    data: string;
    isConditional?: boolean;
}
/**
 * Conditional comment token (IE-specific)
 */
export interface ConditionalCommentToken extends BaseToken {
    type: 'ConditionalComment';
    condition: string;
    content: string;
}
/**
 * DOCTYPE declaration token
 */
export interface DoctypeToken extends BaseToken {
    type: 'Doctype';
    name: string;
    publicId?: string;
    systemId?: string;
}
/**
 * CDATA section token
 */
export interface CDATAToken extends BaseToken {
    type: 'CDATA';
    content: string;
}
/**
 * End-of-file token
 */
export interface EOFToken extends BaseToken {
    type: 'EOF';
}
/**
 * Union type of all possible token types
 */
export declare type HTMLToken = StartTagToken | EndTagToken | TextToken | CommentToken | ConditionalCommentToken | DoctypeToken | CDATAToken | EOFToken;
/**
 * Error information for tokenization errors
 */
export interface TokenizerError {
    message: string;
    severity: 'warning' | 'error';
    line: number;
    column: number;
    start: number;
    end: number;
}
/**
 * Configuration options for the HTML tokenizer
 */
export interface TokenizerOptions {
    xmlMode?: boolean;
    recognizeCDATA?: boolean;
    recognizeConditionalComments?: boolean;
    preserveWhitespace?: boolean;
    allowUnclosedTags?: boolean;
    advanced?: boolean;
}
/**
 * Base class for HTML tokens with validation
 */
export declare class HTMLBaseToken {
    readonly type: TokenType;
    readonly start: number;
    readonly end: number;
    readonly line: number;
    readonly column: number;
    constructor(type: TokenType, start: number, end: number, line: number, column: number);
    protected validateNumber(field: string, value: number): void;
}
/**
 * Start tag token implementation
 */
export declare class StartTagTokenImpl extends HTMLBaseToken implements StartTagToken {
    readonly name: string;
    readonly attributes: Map<string, string>;
    readonly selfClosing: boolean;
    readonly namespace?: string;
    constructor(name: string, attributes: Map<string, string>, selfClosing: boolean, start: number, end: number, line: number, column: number, namespace?: string);
}
/**
 * End tag token implementation
 */
export declare class EndTagTokenImpl extends HTMLBaseToken implements EndTagToken {
    readonly name: string;
    readonly namespace?: string;
    constructor(name: string, start: number, end: number, line: number, column: number, namespace?: string);
}
/**
 * Text token implementation
 */
export declare class TextTokenImpl extends HTMLBaseToken implements TextToken {
    readonly content: string;
    readonly isWhitespace: boolean;
    constructor(content: string, isWhitespace: boolean, start: number, end: number, line: number, column: number);
}
/**
 * Comment token implementation
 */
export declare class CommentTokenImpl extends HTMLBaseToken implements CommentToken {
    readonly data: string;
    readonly isConditional: boolean;
    constructor(data: string, start: number, end: number, line: number, column: number, isConditional?: boolean);
}
/**
 * Conditional comment token implementation
 */
export declare class ConditionalCommentTokenImpl extends HTMLBaseToken implements ConditionalCommentToken {
    readonly condition: string;
    readonly content: string;
    constructor(condition: string, content: string, start: number, end: number, line: number, column: number);
}
/**
 * DOCTYPE token implementation
 */
export declare class DoctypeTokenImpl extends HTMLBaseToken implements DoctypeToken {
    readonly name: string;
    readonly publicId?: string;
    readonly systemId?: string;
    constructor(name: string, start: number, end: number, line: number, column: number, publicId?: string, systemId?: string);
}
/**
 * CDATA token implementation
 */
export declare class CDATATokenImpl extends HTMLBaseToken implements CDATAToken {
    readonly content: string;
    constructor(content: string, start: number, end: number, line: number, column: number);
}
/**
 * EOF token implementation
 */
export declare class EOFTokenImpl extends HTMLBaseToken implements EOFToken {
    constructor(start: number, end: number, line: number, column: number);
}
/**
 * Factory class for creating tokens with validation
 */
export declare class HTMLTokenBuilder {
    /**
     * Creates a start tag token
     */
    static createStartTag(name: string, attributes: Map<string, string>, selfClosing: boolean, start: number, end: number, line: number, column: number, namespace?: string): StartTagToken;
    /**
     * Creates an end tag token
     */
    static createEndTag(name: string, start: number, end: number, line: number, column: number, namespace?: string): EndTagToken;
    /**
     * Creates a text token
     */
    static createText(content: string, isWhitespace: boolean, start: number, end: number, line: number, column: number): TextToken;
    /**
     * Creates a comment token
     */
    static createComment(data: string, start: number, end: number, line: number, column: number, isConditional: boolean): CommentToken;
    /**
     * Creates a conditional comment token
     */
    static createConditionalComment(condition: string, content: string, start: number, end: number, line: number, column: number): ConditionalCommentToken;
    /**
     * Creates a DOCTYPE token
     */
    static createDoctype(name: string, start: number, end: number, line: number, column: number, publicId?: string, systemId?: string): DoctypeToken;
    /**
     * Creates a CDATA token
     */
    static createCDATA(content: string, start: number, end: number, line: number, column: number): CDATAToken;
    /**
     * Creates an EOF token
     */
    static createEOF(start: number, end: number, line: number, column: number): EOFToken;
}
