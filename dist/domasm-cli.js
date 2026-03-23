#!/usr/bin/env node
/*!
 * @obinexusltd/dom-asm v0.1.0
 * (c) 2025 Nnamdi Michael Okpala
 * @license MIT
 */
'use strict';

var commander = require('commander');
var fs = require('fs');
var path = require('path');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

/**
 * Enum-like object defining HTML token types
 */
const HTMLTokenType = {
    StartTag: 'StartTag',
    EndTag: 'EndTag',
    Text: 'Text',
    Comment: 'Comment',
    ConditionalComment: 'ConditionalComment',
    Doctype: 'Doctype',
    CDATA: 'CDATA',
    EOF: 'EOF'
};
/**
 * Base class for HTML tokens with validation
 */
class HTMLBaseToken {
    constructor(type, start, end, line, column) {
        if (!Object.values(HTMLTokenType).includes(type)) {
            throw new TypeError(`Invalid token type: ${type}`);
        }
        this.validateNumber('start', start);
        this.validateNumber('end', end);
        this.validateNumber('line', line);
        this.validateNumber('column', column);
        this.type = type;
        this.start = start;
        this.end = end;
        this.line = line;
        this.column = column;
    }
    validateNumber(field, value) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new TypeError(`${field} must be a valid number`);
        }
    }
}
/**
 * Start tag token implementation
 */
class StartTagTokenImpl extends HTMLBaseToken {
    constructor(name, attributes, selfClosing, start, end, line, column, namespace) {
        super(HTMLTokenType.StartTag, start, end, line, column);
        if (typeof name !== 'string') {
            throw new TypeError('name must be a string');
        }
        if (!(attributes instanceof Map)) {
            throw new TypeError('attributes must be a Map');
        }
        if (typeof selfClosing !== 'boolean') {
            throw new TypeError('selfClosing must be a boolean');
        }
        if (namespace && typeof namespace !== 'string') {
            throw new TypeError('namespace must be a string if provided');
        }
        this.name = name;
        this.attributes = attributes;
        this.selfClosing = selfClosing;
        this.namespace = namespace;
        Object.freeze(this);
    }
}
/**
 * End tag token implementation
 */
class EndTagTokenImpl extends HTMLBaseToken {
    constructor(name, start, end, line, column, namespace) {
        super(HTMLTokenType.EndTag, start, end, line, column);
        if (typeof name !== 'string') {
            throw new TypeError('name must be a string');
        }
        if (namespace && typeof namespace !== 'string') {
            throw new TypeError('namespace must be a string if provided');
        }
        this.name = name;
        this.namespace = namespace;
        Object.freeze(this);
    }
}
/**
 * Text token implementation
 */
class TextTokenImpl extends HTMLBaseToken {
    constructor(content, isWhitespace, start, end, line, column) {
        super(HTMLTokenType.Text, start, end, line, column);
        if (typeof content !== 'string') {
            throw new TypeError('content must be a string');
        }
        if (typeof isWhitespace !== 'boolean') {
            throw new TypeError('isWhitespace must be a boolean');
        }
        this.content = content;
        this.isWhitespace = isWhitespace;
        Object.freeze(this);
    }
}
/**
 * Comment token implementation
 */
class CommentTokenImpl extends HTMLBaseToken {
    constructor(data, start, end, line, column, isConditional = false) {
        super(HTMLTokenType.Comment, start, end, line, column);
        if (typeof data !== 'string') {
            throw new TypeError('data must be a string');
        }
        if (typeof isConditional !== 'boolean') {
            throw new TypeError('isConditional must be a boolean');
        }
        this.data = data;
        this.isConditional = isConditional;
        Object.freeze(this);
    }
}
/**
 * Conditional comment token implementation
 */
class ConditionalCommentTokenImpl extends HTMLBaseToken {
    constructor(condition, content, start, end, line, column) {
        super(HTMLTokenType.ConditionalComment, start, end, line, column);
        if (typeof condition !== 'string') {
            throw new TypeError('condition must be a string');
        }
        if (typeof content !== 'string') {
            throw new TypeError('content must be a string');
        }
        this.condition = condition;
        this.content = content;
        Object.freeze(this);
    }
}
/**
 * DOCTYPE token implementation
 */
class DoctypeTokenImpl extends HTMLBaseToken {
    constructor(name, start, end, line, column, publicId, systemId) {
        super(HTMLTokenType.Doctype, start, end, line, column);
        if (typeof name !== 'string') {
            throw new TypeError('name must be a string');
        }
        if (publicId && typeof publicId !== 'string') {
            throw new TypeError('publicId must be a string if provided');
        }
        if (systemId && typeof systemId !== 'string') {
            throw new TypeError('systemId must be a string if provided');
        }
        this.name = name;
        this.publicId = publicId;
        this.systemId = systemId;
        Object.freeze(this);
    }
}
/**
 * CDATA token implementation
 */
class CDATATokenImpl extends HTMLBaseToken {
    constructor(content, start, end, line, column) {
        super(HTMLTokenType.CDATA, start, end, line, column);
        if (typeof content !== 'string') {
            throw new TypeError('content must be a string');
        }
        this.content = content;
        Object.freeze(this);
    }
}
/**
 * EOF token implementation
 */
class EOFTokenImpl extends HTMLBaseToken {
    constructor(start, end, line, column) {
        super(HTMLTokenType.EOF, start, end, line, column);
        Object.freeze(this);
    }
}
/**
 * Factory class for creating tokens with validation
 */
class HTMLTokenBuilder {
    /**
     * Creates a start tag token
     */
    static createStartTag(name, attributes, selfClosing, start, end, line, column, namespace) {
        return new StartTagTokenImpl(name, attributes, selfClosing, start, end, line, column, namespace);
    }
    /**
     * Creates an end tag token
     */
    static createEndTag(name, start, end, line, column, namespace) {
        return new EndTagTokenImpl(name, start, end, line, column, namespace);
    }
    /**
     * Creates a text token
     */
    static createText(content, isWhitespace, start, end, line, column) {
        return new TextTokenImpl(content, isWhitespace, start, end, line, column);
    }
    /**
     * Creates a comment token
     */
    static createComment(data, start, end, line, column, isConditional) {
        return new CommentTokenImpl(data, start, end, line, column, isConditional);
    }
    /**
     * Creates a conditional comment token
     */
    static createConditionalComment(condition, content, start, end, line, column) {
        return new ConditionalCommentTokenImpl(condition, content, start, end, line, column);
    }
    /**
     * Creates a DOCTYPE token
     */
    static createDoctype(name, start, end, line, column, publicId, systemId) {
        return new DoctypeTokenImpl(name, start, end, line, column, publicId, systemId);
    }
    /**
     * Creates a CDATA token
     */
    static createCDATA(content, start, end, line, column) {
        return new CDATATokenImpl(content, start, end, line, column);
    }
    /**
     * Creates an EOF token
     */
    static createEOF(start, end, line, column) {
        return new EOFTokenImpl(start, end, line, column);
    }
}

/**
 * HTMLTokenizer
 *
 * Converts HTML string input into a stream of tokens that can be processed by a parser.
 * Handles various HTML elements including tags, attributes, text content, comments, etc.
 */
class HTMLTokenizer {
    /**
     * Creates a new HTML tokenizer
     *
     * @param input - The HTML string to tokenize
     * @param options - Configuration options for the tokenizer
     */
    constructor(input, options = {}) {
        this._input = input;
        this._position = 0;
        this._line = 1;
        this._column = 1;
        this._tokens = [];
        this._errors = [];
        this._tagStack = [];
        this._options = Object.assign({
            xmlMode: false,
            recognizeCDATA: true,
            recognizeConditionalComments: true,
            preserveWhitespace: false,
            allowUnclosedTags: true,
            advanced: false,
        }, options);
    }
    /**
     * Tokenizes the input HTML string
     *
     * @returns A result object containing tokens and any errors encountered
     */
    tokenize() {
        while (this._position < this._input.length) {
            const char = this._input[this._position];
            if (char === '<') {
                this.processTag();
            }
            else {
                this.processText();
            }
        }
        // Add EOF token
        const eofToken = HTMLTokenBuilder.createEOF(this._position, this._position, this._line, this._column);
        this._tokens.push(eofToken);
        return {
            tokens: this._tokens,
            errors: this._errors
        };
    }
    /**
     * Processes a tag (opening tag, closing tag, or special tag)
     */
    processTag() {
        const start = this._position;
        const startLine = this._line;
        const startColumn = this._column;
        this.advance(); // Skip '<'
        if (this._input[this._position] === '/') {
            // End tag
            this.advance(); // Skip '/'
            const tagName = this.readTagName();
            if (tagName) {
                const endToken = HTMLTokenBuilder.createEndTag(tagName.toLowerCase(), start, this._position, startLine, startColumn, undefined // namespace
                );
                this._tokens.push(endToken);
            }
            else {
                this.reportError('Malformed end tag', start, this._position);
            }
            this.skipUntil('>');
        }
        else if (this._input[this._position] === '!') {
            // Comment, DOCTYPE, or CDATA
            this.advance(); // Skip '!'
            if (this.match('--')) {
                // Comment
                this.advance(2); // Skip '--'
                this.handleComment(start, startLine, startColumn);
            }
            else if (this._options.recognizeCDATA && this.match('[CDATA[')) {
                // CDATA section
                this.advance(7); // Skip '[CDATA['
                this.handleCDATA(start, startLine, startColumn);
            }
            else if (this.match('DOCTYPE', true)) {
                // DOCTYPE declaration
                this.advance(7); // Skip 'DOCTYPE'
                this.handleDoctype(start, startLine, startColumn);
            }
            else {
                this.reportError('Malformed special tag', start, this._position);
                this.skipUntil('>');
            }
        }
        else if (this._input[this._position] === '?') {
            // Processing instruction (e.g., <?xml ...?>)
            this.advance(); // Skip '?'
            this.skipUntil('?>');
            this.advance(); // Skip additional '>'
        }
        else {
            // Start tag
            const tagName = this.readTagName();
            if (tagName) {
                const attributes = this.readAttributes();
                let selfClosing = false;
                this.skipWhitespace();
                if (this._input[this._position] === '/' && this._input[this._position + 1] === '>') {
                    selfClosing = true;
                    this.advance(); // Skip '/'
                }
                else if (this._input[this._position] === '>') {
                    selfClosing = this.isSelfClosingTag(tagName);
                }
                const startToken = HTMLTokenBuilder.createStartTag(tagName.toLowerCase(), attributes, selfClosing, start, this._position, startLine, startColumn, undefined // namespace
                );
                this._tokens.push(startToken);
            }
            else {
                this.reportError('Malformed start tag', start, this._position);
            }
            this.skipUntil('>');
        }
    }
    /**
     * Processes text content
     */
    processText() {
        const start = this._position;
        const startLine = this._line;
        const startColumn = this._column;
        let content = '';
        while (this._position < this._input.length && this._input[this._position] !== '<') {
            content += this._input[this._position];
            this.advance();
        }
        if (content.trim() || this._options.preserveWhitespace) {
            const textToken = HTMLTokenBuilder.createText(content, content.trim().length === 0, start, this._position, startLine, startColumn);
            this._tokens.push(textToken);
        }
    }
    /**
     * Handles comment tokens
     */
    handleComment(start, startLine, startColumn) {
        let content = '';
        let isConditional = false;
        // Check for conditional comments (IE-specific)
        if (this._options.recognizeConditionalComments &&
            this._position < this._input.length &&
            this._input[this._position] === '[') {
            isConditional = true;
        }
        while (this._position < this._input.length) {
            if (this.match('-->')) {
                break;
            }
            content += this._input[this._position];
            this.advance();
        }
        this.advance(3); // Skip '-->'
        if (isConditional && this._options.recognizeConditionalComments) {
            // Parse conditional comment
            const match = content.match(/^\[if\s+([^\]]+)\]>?([\s\S]*?)<!\[endif\]$/i);
            if (match) {
                const condition = match[1].trim();
                const conditionalContent = match[2].trim();
                const commentToken = HTMLTokenBuilder.createConditionalComment(condition, conditionalContent, start, this._position, startLine, startColumn);
                this._tokens.push(commentToken);
            }
            else {
                // Fallback to regular comment if malformed conditional comment
                const commentToken = HTMLTokenBuilder.createComment(content.trim(), start, this._position, startLine, startColumn, false);
                this._tokens.push(commentToken);
            }
        }
        else {
            // Regular comment
            const commentToken = HTMLTokenBuilder.createComment(content.trim(), start, this._position, startLine, startColumn, false);
            this._tokens.push(commentToken);
        }
    }
    /**
     * Handles CDATA section tokens
     */
    handleCDATA(start, startLine, startColumn) {
        let content = '';
        while (this._position < this._input.length) {
            if (this.match(']]>')) {
                break;
            }
            content += this._input[this._position];
            this.advance();
        }
        this.advance(3); // Skip ']]>'
        const cdataToken = HTMLTokenBuilder.createCDATA(content, start, this._position, startLine, startColumn);
        this._tokens.push(cdataToken);
    }
    /**
     * Handles DOCTYPE declaration tokens
     */
    handleDoctype(start, startLine, startColumn) {
        this.skipWhitespace();
        // Read DOCTYPE name
        let name = 'html'; // Default name
        let publicId = undefined;
        let systemId = undefined;
        // Simple approach for now - more robust parsing would handle quoted strings properly
        if (/[a-zA-Z]/.test(this._input[this._position])) {
            name = this.readUntil(c => /[\s>]/.test(c)).toLowerCase();
        }
        // Look for PUBLIC or SYSTEM identifiers
        this.skipWhitespace();
        if (this.match('PUBLIC', true)) {
            this.advance(6);
            this.skipWhitespace();
            // Read public identifier
            const quote = this._input[this._position];
            if (quote === '"' || quote === "'") {
                this.advance();
                publicId = this.readUntil(c => c === quote);
                this.advance();
            }
            // Check for system identifier
            this.skipWhitespace();
            const nextQuote = this._input[this._position];
            if (nextQuote === '"' || nextQuote === "'") {
                this.advance();
                systemId = this.readUntil(c => c === nextQuote);
                this.advance();
            }
        }
        else if (this.match('SYSTEM', true)) {
            this.advance(6);
            this.skipWhitespace();
            // Read system identifier
            const quote = this._input[this._position];
            if (quote === '"' || quote === "'") {
                this.advance();
                systemId = this.readUntil(c => c === quote);
                this.advance();
            }
        }
        // Skip to the end of the DOCTYPE
        while (this._position < this._input.length && this._input[this._position] !== '>') {
            this.advance();
        }
        this.advance(); // Skip '>'
        const doctypeToken = HTMLTokenBuilder.createDoctype(name, start, this._position, startLine, startColumn, publicId, systemId);
        this._tokens.push(doctypeToken);
    }
    /**
     * Reads attributes from a start tag
     *
     * @returns A map of attribute names to their values
     */
    readAttributes() {
        const attributes = new Map();
        while (this._position < this._input.length) {
            this.skipWhitespace();
            if (this._input[this._position] === '>' ||
                this._input[this._position] === '/' ||
                this._input[this._position] === '?') {
                break;
            }
            const attributeName = this.readAttributeName();
            if (!attributeName)
                break;
            let attributeValue = '';
            this.skipWhitespace();
            if (this._input[this._position] === '=') {
                this.advance(); // Skip '='
                this.skipWhitespace();
                attributeValue = this.readAttributeValue();
            }
            attributes.set(attributeName.toLowerCase(), attributeValue);
        }
        return attributes;
    }
    /**
     * Reads an attribute name
     *
     * @returns The attribute name or empty string if none found
     */
    readAttributeName() {
        let name = '';
        while (this._position < this._input.length) {
            const char = this._input[this._position];
            if (/[\s=\/>\?]/.test(char))
                break;
            name += char;
            this.advance();
        }
        return name;
    }
    /**
     * Reads an attribute value
     *
     * @returns The attribute value
     */
    readAttributeValue() {
        const quote = this._input[this._position];
        if (quote === '"' || quote === "'") {
            this.advance(); // Skip opening quote
            const value = this.readUntil(c => c === quote);
            this.advance(); // Skip closing quote
            return value;
        }
        // Unquoted attribute value
        return this.readUntil(c => /[\s>\/]/.test(c));
    }
    /**
     * Reads a tag name
     *
     * @returns The tag name or empty string if none found
     */
    readTagName() {
        let name = '';
        while (this._position < this._input.length) {
            const char = this._input[this._position];
            if (!/[a-zA-Z0-9\-\_\:\.]/.test(char))
                break;
            name += char;
            this.advance();
        }
        return name;
    }
    /**
     * Checks if a tag is self-closing by HTML specification
     *
     * @param tagName - The tag name to check
     * @returns Whether the tag is self-closing
     */
    isSelfClosingTag(tagName) {
        // These elements are self-closing by HTML5 spec
        const selfClosingTags = [
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        ];
        return selfClosingTags.includes(tagName.toLowerCase());
    }
    /**
     * Skips to a specific character and advances past it
     *
     * @param char - The character to skip to
     */
    skipUntil(char) {
        while (this._position < this._input.length &&
            !this.match(char)) {
            this.advance();
        }
        if (this._position < this._input.length) {
            this.advance(char.length); // Skip the target sequence
        }
    }
    /**
     * Reads until a predicate function returns true
     *
     * @param predicate - The function to test each character
     * @returns The read string
     */
    readUntil(predicate) {
        let result = '';
        while (this._position < this._input.length &&
            !predicate(this._input[this._position])) {
            result += this._input[this._position];
            this.advance();
        }
        return result;
    }
    /**
     * Skips whitespace characters
     */
    skipWhitespace() {
        while (this._position < this._input.length &&
            this.isWhitespace(this._input[this._position])) {
            this.advance();
        }
    }
    /**
     * Checks if a character is whitespace
     *
     * @param char - The character to check
     * @returns Whether the character is whitespace
     */
    isWhitespace(char) {
        return /\s/.test(char);
    }
    /**
     * Checks if the input at current position matches a string
     *
     * @param str - The string to match
     * @param caseInsensitive - Whether to match case-insensitively
     * @returns Whether the string matches
     */
    match(str, caseInsensitive = false) {
        if (this._position + str.length > this._input.length) {
            return false;
        }
        if (caseInsensitive) {
            return this._input.substring(this._position, this._position + str.length)
                .toLowerCase() === str.toLowerCase();
        }
        return this._input.substring(this._position, this._position + str.length) === str;
    }
    /**
     * Advances the position by a number of characters
     *
     * @param count - The number of characters to advance by (default: 1)
     * @returns The character at the previous position
     */
    advance(count = 1) {
        const char = this._input[this._position];
        for (let i = 0; i < count && this._position < this._input.length; i++) {
            if (this._input[this._position] === '\n') {
                this._line++;
                this._column = 1;
            }
            else {
                this._column++;
            }
            this._position++;
        }
        return char;
    }
    /**
     * Reports an error during tokenization
     *
     * @param message - The error message
     * @param start - The start position of the error
     * @param end - The end position of the error
     * @param severity - The severity of the error
     */
    reportError(message, start, end, severity = 'error') {
        this._errors.push({
            message,
            severity,
            line: this._line,
            column: this._column,
            start,
            end
        });
    }
    /**
     * Checks if there are any unclosed tags
     *
     * @returns Whether there are unclosed tags
     */
    hasUnclosedTags() {
        const stack = [];
        for (const token of this._tokens) {
            if (token.type === HTMLTokenType.StartTag) {
                const startToken = token;
                if (!startToken.selfClosing) {
                    stack.push(startToken.name);
                }
            }
            else if (token.type === HTMLTokenType.EndTag) {
                const endToken = token;
                if (stack.length > 0 && stack[stack.length - 1] === endToken.name) {
                    stack.pop();
                }
            }
        }
        return stack.length > 0;
    }
}

/**
 * Error class for HTML parsing errors
 */
class HTMLParserError extends Error {
    constructor(params) {
        super(`${params.message} at position ${params.position}`);
        this.name = 'HTMLParserError';
        this.token = params.token;
        this.state = params.state;
        this.position = params.position;
    }
}
/**
 * HTMLParser
 *
 * Parses HTML tokens into an Abstract Syntax Tree (AST) representation.
 * Implements automaton-based parsing with state minimization for optimization.
 */
class HTMLParser {
    /**
     * Creates a new HTML parser
     */
    constructor() {
        this.states = new Set();
        this.currentState = null;
        this.equivalenceClasses = new Map();
        this.optimizedStateMap = new Map();
        this.initializeStates();
    }
    /**
     * Initializes the state machine for HTML parsing
     */
    initializeStates() {
        // Create base states
        const initialState = {
            type: 'Initial',
            isAccepting: false,
            transitions: new Map()
        };
        const inTagState = {
            type: 'InTag',
            isAccepting: false,
            transitions: new Map()
        };
        const inContentState = {
            type: 'InContent',
            isAccepting: true,
            transitions: new Map()
        };
        const inCommentState = {
            type: 'InComment',
            isAccepting: false,
            transitions: new Map()
        };
        const inDoctypeState = {
            type: 'InDoctype',
            isAccepting: false,
            transitions: new Map()
        };
        const finalState = {
            type: 'Final',
            isAccepting: true,
            transitions: new Map()
        };
        // Set up transitions
        initialState.transitions.set('<', inTagState);
        initialState.transitions.set('text', inContentState);
        inTagState.transitions.set('>', inContentState);
        inTagState.transitions.set('!', inDoctypeState);
        inTagState.transitions.set('<!--', inCommentState);
        inContentState.transitions.set('<', inTagState);
        inContentState.transitions.set('EOF', finalState);
        inCommentState.transitions.set('-->', inContentState);
        inDoctypeState.transitions.set('>', inContentState);
        // Initialize state collections
        this.states.clear();
        this.states.add(initialState);
        this.states.add(inTagState);
        this.states.add(inContentState);
        this.states.add(inCommentState);
        this.states.add(inDoctypeState);
        this.states.add(finalState);
        // Set initial state
        this.currentState = initialState;
        // Clear maps
        this.equivalenceClasses.clear();
        this.optimizedStateMap.clear();
    }
    /**
     * Parses HTML input string into an AST
     *
     * @param input - The HTML string to parse
     * @returns The parsed HTML AST
     */
    parse(input) {
        const tokenizer = new HTMLTokenizer(input);
        const { tokens } = tokenizer.tokenize();
        this.minimizeStates();
        const ast = this.buildOptimizedAST(tokens);
        return this.optimizeAST(ast);
    }
    /**
     * Minimizes the parser states using Hopcroft's algorithm
     */
    minimizeStates() {
        const accepting = new Set([...this.states].filter(s => s.isAccepting));
        const nonAccepting = new Set([...this.states].filter(s => !s.isAccepting));
        let partition = [accepting, nonAccepting];
        let newPartition = [];
        do {
            partition = newPartition.length > 0 ? newPartition : partition;
            newPartition = [];
            for (const block of partition) {
                const splits = this.splitBlock(block, partition);
                newPartition.push(...splits);
            }
        } while (newPartition.length !== partition.length);
        partition.forEach((block, index) => {
            this.equivalenceClasses.set(index, block);
        });
        // Create mapping from original states to optimized states
        for (const [classId, stateSet] of this.equivalenceClasses) {
            const representativeState = stateSet.values().next().value;
            for (const state of stateSet) {
                this.optimizedStateMap.set(state, representativeState);
            }
        }
    }
    /**
     * Splits a block of states based on their transitions
     *
     * @param block - The block of states to split
     * @param partition - The current partition of states
     * @returns The split blocks
     */
    splitBlock(block, partition) {
        if (block.size <= 1)
            return [block];
        const splits = new Map();
        for (const state of block) {
            const signature = this.getStateSignature(state, partition);
            if (!splits.has(signature)) {
                splits.set(signature, new Set());
            }
            splits.get(signature).add(state);
        }
        return Array.from(splits.values());
    }
    /**
     * Creates a signature for a state based on its transitions
     *
     * @param state - The state to create a signature for
     * @param partition - The current partition of states
     * @returns A string signature uniquely identifying the state's behavior
     */
    getStateSignature(state, partition) {
        const transitions = [];
        for (const [symbol, targetState] of state.transitions) {
            const targetPartition = partition.findIndex(block => block.has(targetState));
            transitions.push(`${symbol}:${targetPartition}`);
        }
        return transitions.sort().join('|');
    }
    /**
     * Builds an optimized AST from tokens using the minimized state machine
     *
     * @param tokens - The tokens to build the AST from
     * @returns The built HTML AST
     */
    buildOptimizedAST(tokens) {
        const root = {
            type: 'Element',
            name: 'root',
            children: [],
            metadata: {
                equivalenceClass: 0,
                isMinimized: false
            }
        };
        const stack = [root];
        let currentNode = root;
        for (const token of tokens) {
            try {
                currentNode = this.processTokenWithOptimizedState(token, currentNode, stack);
            }
            catch (error) {
                if (error instanceof HTMLParserError) {
                    this.handleParserError(error, currentNode);
                }
                else {
                    // Re-throw unknown errors
                    throw error;
                }
            }
        }
        return {
            root,
            metadata: {}
        };
    }
    /**
     * Processes a token using the optimized state machine
     *
     * @param token - The token to process
     * @param currentNode - The current node being built
     * @param stack - The node stack for tracking nested elements
     * @returns The new current node
     */
    processTokenWithOptimizedState(token, currentNode, stack) {
        var _a, _b;
        const optimizedState = this.optimizedStateMap.get(this.currentState) || this.currentState;
        switch (token.type) {
            case HTMLTokenType.StartTag: {
                const element = {
                    type: 'Element',
                    name: token.name,
                    attributes: (_a = token.attributes) !== null && _a !== void 0 ? _a : new Map(),
                    children: [],
                    metadata: {
                        equivalenceClass: this.getEquivalenceClass(optimizedState),
                        isMinimized: true
                    }
                };
                currentNode.children.push(element);
                if (!token.selfClosing) {
                    stack.push(element);
                    currentNode = element;
                }
                break;
            }
            case HTMLTokenType.EndTag: {
                if (stack.length > 1) {
                    // Try to find matching start tag
                    let matchFound = false;
                    for (let i = stack.length - 1; i >= 1; i--) {
                        if (stack[i].name === token.name) {
                            // Found matching start tag, pop back to it
                            currentNode = stack[i];
                            stack.length = i + 1;
                            // Move up one level
                            currentNode = stack[i - 1];
                            matchFound = true;
                            break;
                        }
                    }
                    // Handle unmatched end tag
                    if (!matchFound) {
                        // Just pop one level (more tolerant approach)
                        if (stack.length > 1) {
                            stack.pop();
                            currentNode = stack[stack.length - 1];
                        }
                    }
                }
                break;
            }
            case HTMLTokenType.Text: {
                // Skip empty text nodes unless preserveWhitespace is enabled
                if ((((_b = token.content) === null || _b === void 0 ? void 0 : _b.trim()) || '').length > 0 || token.isWhitespace) {
                    const node = {
                        type: 'Text',
                        value: token.content,
                        children: [],
                        metadata: {
                            equivalenceClass: this.getEquivalenceClass(optimizedState),
                            isMinimized: true
                        }
                    };
                    currentNode.children.push(node);
                }
                break;
            }
            case HTMLTokenType.Comment: {
                const node = {
                    type: 'Comment',
                    value: token.data,
                    children: [],
                    metadata: {
                        equivalenceClass: this.getEquivalenceClass(optimizedState),
                        isMinimized: true
                    }
                };
                currentNode.children.push(node);
                break;
            }
            case HTMLTokenType.Doctype: {
                const node = {
                    type: 'Doctype',
                    name: token.name,
                    children: [],
                    metadata: {
                        equivalenceClass: this.getEquivalenceClass(optimizedState),
                        isMinimized: true
                    }
                };
                currentNode.children.push(node);
                break;
            }
            case HTMLTokenType.CDATA: {
                const node = {
                    type: 'CDATA',
                    value: token.content,
                    children: [],
                    metadata: {
                        equivalenceClass: this.getEquivalenceClass(optimizedState),
                        isMinimized: true
                    }
                };
                currentNode.children.push(node);
                break;
            }
            case HTMLTokenType.ConditionalComment: {
                const node = {
                    type: 'ConditionalComment',
                    value: token.content,
                    attributes: new Map([['condition', token.condition]]),
                    children: [],
                    metadata: {
                        equivalenceClass: this.getEquivalenceClass(optimizedState),
                        isMinimized: true
                    }
                };
                currentNode.children.push(node);
                break;
            }
            // Ignore EOF token
            case HTMLTokenType.EOF:
                break;
            default: {
                const unknownToken = token;
                throw new HTMLParserError({
                    message: `Unknown token type: ${unknownToken.type}`,
                    token: unknownToken,
                    state: optimizedState,
                    position: unknownToken.start
                });
            }
        }
        return currentNode;
    }
    /**
     * Optimizes an AST by merging text nodes and removing redundant nodes
     *
     * @param ast - The AST to optimize
     * @returns The optimized AST
     */
    optimizeAST(ast) {
        this.mergeTextNodes(ast.root);
        this.removeRedundantNodes(ast.root);
        this.optimizeAttributes(ast.root);
        ast.metadata.minimizationMetrics = {
            originalStateCount: this.states.size,
            minimizedStateCount: this.equivalenceClasses.size,
            optimizationRatio: this.equivalenceClasses.size / this.states.size
        };
        return ast;
    }
    /**
     * Merges adjacent text nodes
     *
     * @param node - The node to process
     */
    mergeTextNodes(node) {
        if (!node.children.length)
            return;
        // Process children first (depth-first)
        for (const child of node.children) {
            if (child.type === 'Element') {
                this.mergeTextNodes(child);
            }
        }
        // Merge adjacent text nodes
        let i = 0;
        while (i < node.children.length - 1) {
            const current = node.children[i];
            const next = node.children[i + 1];
            if (current.type === 'Text' && next.type === 'Text') {
                current.value = (current.value || '') + (next.value || '');
                node.children.splice(i + 1, 1);
            }
            else {
                i++;
            }
        }
    }
    /**
     * Removes redundant nodes like empty text nodes
     *
     * @param node - The node to process
     */
    removeRedundantNodes(node) {
        node.children = node.children.filter(child => {
            if (child.type === 'Text') {
                return child.value && child.value.trim().length > 0;
            }
            this.removeRedundantNodes(child);
            return true;
        });
    }
    /**
     * Optimizes attributes by normalizing keys
     *
     * @param node - The node to process
     */
    optimizeAttributes(node) {
        if (node.attributes) {
            const optimizedAttributes = new Map();
            for (const [key, value] of node.attributes.entries()) {
                const normalizedKey = key.toLowerCase();
                optimizedAttributes.set(normalizedKey, value);
            }
            node.attributes = optimizedAttributes;
        }
        node.children.forEach(child => this.optimizeAttributes(child));
    }
    /**
     * Gets the equivalence class for a state
     *
     * @param state - The state to get the equivalence class for
     * @returns The equivalence class ID
     */
    getEquivalenceClass(state) {
        for (const [classId, states] of this.equivalenceClasses) {
            if (states.has(state))
                return classId;
        }
        return -1;
    }
    /**
     * Handles a parser error
     *
     * @param error - The error to handle
     * @param currentNode - The current node when the error occurred
     */
    handleParserError(error, currentNode) {
        console.error(`Parser error in state ${error.state.type}:`, error.message);
        // Add error info to the current node's metadata
        currentNode.metadata.error = {
            message: error.message,
            position: error.position,
            state: error.state.type
        };
    }
    /**
     * Computes metadata for an AST
     *
     * @param node - The root node
     * @returns The computed metadata
     */
    computeOptimizedMetadata(root) {
        const countNodes = (node) => {
            switch (node.type) {
                case 'Element':
                    node.metadata.nodeCount = (node.metadata.nodeCount || 0) + 1;
                    break;
                case 'Text':
                    node.metadata.textCount = (node.metadata.textCount || 0) + 1;
                    break;
                case 'Comment':
                    node.metadata.commentCount = (node.metadata.commentCount || 0) + 1;
                    break;
            }
            node.children.forEach(countNodes);
        };
        countNodes(root);
    }
}

/**
 * HTMLAstOptimizer
 * Optimizes AST (Abstract Syntax Tree) representations of HTML by identifying
 * and merging equivalent nodes, reducing redundancy while preserving semantics.
 */
class HTMLAstOptimizer {
    constructor() {
        this.stateClasses = new Map();
        this.nodeSignatures = new Map();
        this.minimizedNodes = new WeakMap();
    }
    /**
     * Optimize an AST to reduce redundancy while preserving semantics.
     *
     * @param ast - The AST to optimize
     * @returns An optimized AST with equivalent functionality
     */
    optimize(ast) {
        try {
            // Phase 1: Build state equivalence classes
            this.buildStateClasses(ast);
            // Phase 2: Node reduction and path optimization
            const optimizedAST = this.optimizeNode(ast.root);
            // Phase 3: Memory optimization
            this.applyMemoryOptimizations(optimizedAST);
            // Compute optimization metrics
            const metrics = this.computeOptimizationMetrics(ast.root, optimizedAST);
            return {
                root: optimizedAST,
                metadata: {
                    ...ast.metadata,
                    optimizationMetrics: metrics
                }
            };
        }
        catch (error) {
            throw new Error(`AST optimization failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Builds equivalence classes for nodes in the AST based on their structure and semantics.
     *
     * @param ast - The AST to analyze
     */
    buildStateClasses(ast) {
        const stateSignatures = new Map();
        // First pass: Collect state signatures
        const collectSignatures = (node) => {
            var _a;
            const signature = this.computeNodeSignature(node);
            if (!stateSignatures.has(signature)) {
                stateSignatures.set(signature, new Set());
            }
            (_a = stateSignatures.get(signature)) === null || _a === void 0 ? void 0 : _a.add(node);
            if (node.children) {
                node.children.forEach(collectSignatures);
            }
        };
        collectSignatures(ast.root);
        // Second pass: Build equivalence classes
        let classId = 0;
        for (const [signature, nodes] of stateSignatures) {
            if (nodes.size > 1) {
                this.stateClasses.set(classId, {
                    signature,
                    nodes: new Set(nodes)
                });
                classId++;
            }
        }
    }
    /**
     * Computes a unique signature for a node based on its structure and content.
     *
     * @param node - The node to compute a signature for
     * @returns A string signature that uniquely identifies the node's structure
     */
    computeNodeSignature(node) {
        const components = [];
        // Add type and name
        components.push(node.type);
        if (node.name)
            components.push(node.name);
        // Add attributes signature
        if (node.attributes && node.attributes.size > 0) {
            const sortedAttrs = Array.from(node.attributes.entries())
                .sort(([a], [b]) => a.localeCompare(b));
            components.push(JSON.stringify(sortedAttrs));
        }
        // Add children types signature
        if (node.children && node.children.length > 0) {
            const childrenTypes = node.children.map(child => child.type).join(',');
            components.push(childrenTypes);
        }
        return components.join('|');
    }
    /**
     * Optimizes a node by reducing redundancy and applying optimizations.
     *
     * @param node - The node to optimize
     * @returns An optimized version of the node
     */
    optimizeNode(node) {
        // Check if node has already been minimized
        if (this.minimizedNodes.has(node)) {
            return this.minimizedNodes.get(node);
        }
        // Create optimized node
        const optimized = {
            type: node.type,
            children: [],
            metadata: {
                ...node.metadata,
                isMinimized: true
            }
        };
        // Copy essential properties
        if (node.name)
            optimized.name = node.name;
        if (node.value)
            optimized.value = node.value;
        if (node.attributes) {
            optimized.attributes = new Map(Array.from(node.attributes.entries())
                .filter(([_, value]) => value !== null && value !== ''));
        }
        // Optimize children
        if (node.children && node.children.length > 0) {
            optimized.children = this.optimizeChildren(node.children);
        }
        // Cache optimized node
        this.minimizedNodes.set(node, optimized);
        return optimized;
    }
    /**
     * Optimizes a list of child nodes by removing redundancies and merging when possible.
     *
     * @param children - The child nodes to optimize
     * @returns An optimized list of child nodes
     */
    optimizeChildren(children) {
        // Remove redundant text nodes
        const optimizedChildren = children
            .filter(child => {
            if (child.type === 'Text') {
                return child.value && child.value.trim().length > 0;
            }
            return true;
        })
            .map(child => this.optimizeNode(child));
        // Merge adjacent text nodes
        return this.mergeAdjacentTextNodes(optimizedChildren);
    }
    /**
     * Merges adjacent text nodes to reduce node count.
     *
     * @param children - The child nodes to process
     * @returns Nodes with adjacent text nodes merged
     */
    mergeAdjacentTextNodes(children) {
        const merged = [];
        let currentTextNode = null;
        for (const child of children) {
            if (child.type === 'Text') {
                if (currentTextNode) {
                    currentTextNode.value = `${currentTextNode.value || ''}${child.value || ''}`;
                }
                else {
                    currentTextNode = { ...child };
                    merged.push(currentTextNode);
                }
            }
            else {
                currentTextNode = null;
                merged.push(child);
            }
        }
        return merged;
    }
    /**
     * Applies memory optimizations to the optimized node structure.
     *
     * @param node - The node to optimize for memory usage
     */
    applyMemoryOptimizations(node) {
        // Freeze objects to prevent modifications
        Object.freeze(node.metadata);
        if (node.attributes) {
            Object.freeze(node.attributes);
        }
        // Recursively optimize children
        if (node.children) {
            node.children.forEach(this.applyMemoryOptimizations.bind(this));
            Object.freeze(node.children);
        }
        // Freeze the node itself
        Object.freeze(node);
    }
    /**
     * Computes optimization metrics by comparing original and optimized trees.
     *
     * @param originalRoot - The root node of the original AST
     * @param optimizedRoot - The root node of the optimized AST
     * @returns Metrics showing the effectiveness of the optimization
     */
    computeOptimizationMetrics(originalRoot, optimizedRoot) {
        const originalMetrics = this.getNodeMetrics(originalRoot);
        const optimizedMetrics = this.getNodeMetrics(optimizedRoot);
        const totalNodes = Array.from(this.stateClasses.values())
            .reduce((acc, cls) => acc + cls.nodes.size, 0);
        const averageSize = totalNodes / this.stateClasses.size || 0;
        return {
            nodeReduction: {
                original: originalMetrics.totalNodes,
                optimized: optimizedMetrics.totalNodes,
                ratio: optimizedMetrics.totalNodes / originalMetrics.totalNodes
            },
            memoryUsage: {
                original: originalMetrics.estimatedMemory,
                optimized: optimizedMetrics.estimatedMemory,
                ratio: optimizedMetrics.estimatedMemory / originalMetrics.estimatedMemory
            },
            stateClasses: {
                count: this.stateClasses.size,
                averageSize
            }
        };
    }
    /**
     * Gets node metrics including total count and estimated memory usage.
     *
     * @param node - The node to analyze
     * @param metrics - Optional existing metrics to update
     * @returns Updated metrics for the node and its children
     */
    getNodeMetrics(node, metrics = { totalNodes: 0, estimatedMemory: 0 }) {
        metrics.totalNodes++;
        metrics.estimatedMemory += this.estimateNodeMemory(node);
        if (node.children) {
            node.children.forEach(child => this.getNodeMetrics(child, metrics));
        }
        return metrics;
    }
    /**
     * Estimates memory usage for a node.
     *
     * @param node - The node to estimate memory usage for
     * @returns Estimated bytes used by the node
     */
    estimateNodeMemory(node) {
        var _a, _b, _c, _d, _e, _f;
        let bytes = 0;
        // Base object overhead
        bytes += 40;
        // Type and name strings
        bytes += ((_b = (_a = node.type) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) * 2;
        bytes += ((_d = (_c = node.name) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) * 2;
        // Value for text nodes
        if (node.type === 'Text') {
            bytes += ((_f = (_e = node.value) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) * 2;
        }
        // Attributes
        if (node.attributes) {
            for (const [key, value] of node.attributes.entries()) {
                bytes += (key.length + String(value).length) * 2;
            }
        }
        // Metadata
        bytes += JSON.stringify(node.metadata).length * 2;
        return bytes;
    }
}

/**
 * DiffPatchEngine
 * Computes differences between two ASTs and generates patches that can be
 * applied to the DOM to transform it from one state to another.
 */
class DiffPatchEngine {
    constructor(options = {}) {
        this.options = {
            ignoreWhitespace: true,
            ignoreCase: false,
            optimizeTextChanges: true,
            useKeyAttribute: 'key',
            ...options
        };
        this.keyMap = new Map();
    }
    /**
     * Computes differences between two ASTs.
     *
     * @param oldAST - The original AST
     * @param newAST - The new AST
     * @returns An array of differences
     */
    diff(oldAST, newAST) {
        this.keyMap.clear();
        // Preprocess ASTs to identify nodes with keys
        this.preprocessKeysInAST(oldAST.root, []);
        const diffs = [];
        this.diffNodes(oldAST.root, newAST.root, [], diffs);
        // Optimize the diffs
        return this.optimizeDiffs(diffs);
    }
    /**
     * Preprocesses an AST to identify and map nodes with key attributes.
     *
     * @param node - The node to preprocess
     * @param path - The current path to the node
     */
    preprocessKeysInAST(node, path) {
        if (!node)
            return;
        // Check if the node has a key attribute
        const keyAttr = this.options.useKeyAttribute;
        if (keyAttr && node.attributes && node.attributes.has(keyAttr)) {
            const key = node.attributes.get(keyAttr);
            if (key) {
                this.keyMap.set(key, [...path]);
            }
        }
        // Process children
        if (node.children) {
            node.children.forEach((child, index) => {
                this.preprocessKeysInAST(child, [...path, index]);
            });
        }
    }
    /**
     * Recursively computes differences between two nodes.
     *
     * @param oldNode - The original node
     * @param newNode - The new node
     * @param path - The current path to the node
     * @param diffs - The array of differences to update
     */
    diffNodes(oldNode, newNode, path, diffs) {
        // Handle case where both nodes are null
        if (!oldNode && !newNode)
            return;
        // Handle case where old node is null (addition)
        if (!oldNode && newNode) {
            diffs.push({
                type: 'ADD',
                path,
                node: this.cloneNode(newNode)
            });
            return;
        }
        // Handle case where new node is null (removal)
        if (oldNode && !newNode) {
            diffs.push({
                type: 'REMOVE',
                path
            });
            return;
        }
        // Both nodes exist, compare them
        if (oldNode && newNode) {
            // If node types differ, replace the whole node
            if (oldNode.type !== newNode.type) {
                diffs.push({
                    type: 'REPLACE',
                    path,
                    node: this.cloneNode(newNode)
                });
                return;
            }
            // Check for attribute changes
            const attrChanges = this.diffAttributes(oldNode, newNode);
            if (Object.keys(attrChanges).length > 0) {
                diffs.push({
                    type: 'UPDATE',
                    path,
                    changes: attrChanges
                });
            }
            // Special handling for text nodes
            if (oldNode.type === 'Text' && newNode.type === 'Text') {
                const oldText = this.options.ignoreWhitespace
                    ? (oldNode.value || '').trim()
                    : (oldNode.value || '');
                const newText = this.options.ignoreWhitespace
                    ? (newNode.value || '').trim()
                    : (newNode.value || '');
                if (oldText !== newText) {
                    diffs.push({
                        type: 'UPDATE',
                        path,
                        changes: { value: newNode.value }
                    });
                }
                return;
            }
            // Recursively diff children
            this.diffChildren(oldNode, newNode, path, diffs);
        }
    }
    /**
     * Computes differences between the attributes of two nodes.
     *
     * @param oldNode - The original node
     * @param newNode - The new node
     * @returns Object containing attribute changes
     */
    diffAttributes(oldNode, newNode) {
        const changes = {};
        // Handle missing attributes map
        const oldAttributes = oldNode.attributes || new Map();
        const newAttributes = newNode.attributes || new Map();
        // Check for added or changed attributes
        for (const [key, value] of newAttributes.entries()) {
            if (!oldAttributes.has(key)) {
                // Attribute was added
                changes[key] = value;
            }
            else if (oldAttributes.get(key) !== value) {
                // Attribute value changed
                changes[key] = value;
            }
        }
        // Check for removed attributes
        for (const key of oldAttributes.keys()) {
            if (!newAttributes.has(key)) {
                changes[key] = null; // Mark as removed
            }
        }
        return changes;
    }
    /**
     * Computes differences between the children of two nodes.
     * Uses key attributes for improved matching when available.
     *
     * @param oldNode - The original node
     * @param newNode - The new node
     * @param path - The current path to the node
     * @param diffs - The array of differences to update
     */
    diffChildren(oldNode, newNode, path, diffs) {
        const oldChildren = oldNode.children || [];
        const newChildren = newNode.children || [];
        // Use key attribute to match nodes if possible
        const keyAttr = this.options.useKeyAttribute;
        if (keyAttr) {
            this.diffChildrenWithKeys(oldChildren, newChildren, path, diffs);
        }
        else {
            this.diffChildrenWithoutKeys(oldChildren, newChildren, path, diffs);
        }
    }
    /**
     * Diffs children using key attributes to match nodes.
     * This allows for more accurate tracking of node movement.
     *
     * @param oldChildren - The original children
     * @param newChildren - The new children
     * @param path - The current path to the parent node
     * @param diffs - The array of differences to update
     */
    diffChildrenWithKeys(oldChildren, newChildren, path, diffs) {
        const oldKeyMap = new Map();
        const newKeyMap = new Map();
        // Build maps of keyed nodes
        oldChildren.forEach((node, index) => {
            if (node.attributes && node.attributes.has(this.options.useKeyAttribute)) {
                const key = node.attributes.get(this.options.useKeyAttribute);
                if (key) {
                    oldKeyMap.set(key, { node, index });
                }
            }
        });
        newChildren.forEach((node, index) => {
            if (node.attributes && node.attributes.has(this.options.useKeyAttribute)) {
                const key = node.attributes.get(this.options.useKeyAttribute);
                if (key) {
                    newKeyMap.set(key, { node, index });
                }
            }
        });
        // Process removals and moves first
        const processedIndices = new Set();
        oldChildren.forEach((oldChild, oldIndex) => {
            var _a;
            const oldKey = (_a = oldChild.attributes) === null || _a === void 0 ? void 0 : _a.get(this.options.useKeyAttribute);
            if (oldKey && newKeyMap.has(oldKey)) {
                // Node exists in both trees
                const { index: newIndex } = newKeyMap.get(oldKey);
                if (oldIndex !== newIndex) {
                    // Node has moved
                    diffs.push({
                        type: 'MOVE',
                        path: [...path, oldIndex],
                        from: [...path, oldIndex],
                        to: [...path, newIndex]
                    });
                }
                // Recursively diff this node
                this.diffNodes(oldChild, newKeyMap.get(oldKey).node, [...path, newIndex], diffs);
                processedIndices.add(newIndex);
            }
            else {
                // Node was removed
                diffs.push({
                    type: 'REMOVE',
                    path: [...path, oldIndex]
                });
            }
        });
        // Process additions
        newChildren.forEach((newChild, newIndex) => {
            if (!processedIndices.has(newIndex)) {
                // This is a new node
                diffs.push({
                    type: 'ADD',
                    path: [...path, newIndex],
                    node: this.cloneNode(newChild)
                });
            }
        });
    }
    /**
     * Diffs children without using key attributes.
     * Uses position-based comparison with heuristics for better matching.
     *
     * @param oldChildren - The original children
     * @param newChildren - The new children
     * @param path - The current path to the parent node
     * @param diffs - The array of differences to update
     */
    diffChildrenWithoutKeys(oldChildren, newChildren, path, diffs) {
        // Use a simple Longest Common Subsequence (LCS) approach
        const lcsMatrix = this.buildLCSMatrix(oldChildren, newChildren);
        const matchedPairs = this.extractMatchedPairs(lcsMatrix, oldChildren, newChildren);
        const oldMatched = new Set();
        const newMatched = new Set();
        // Process matched nodes first
        for (const [oldIndex, newIndex] of matchedPairs) {
            oldMatched.add(oldIndex);
            newMatched.add(newIndex);
            // Recursively diff matched nodes
            this.diffNodes(oldChildren[oldIndex], newChildren[newIndex], [...path, newIndex], diffs);
        }
        // Process removals (nodes in old but not in new)
        for (let i = 0; i < oldChildren.length; i++) {
            if (!oldMatched.has(i)) {
                diffs.push({
                    type: 'REMOVE',
                    path: [...path, i]
                });
            }
        }
        // Process additions (nodes in new but not in old)
        for (let i = 0; i < newChildren.length; i++) {
            if (!newMatched.has(i)) {
                diffs.push({
                    type: 'ADD',
                    path: [...path, i],
                    node: this.cloneNode(newChildren[i])
                });
            }
        }
    }
    /**
     * Builds a Longest Common Subsequence matrix for two sets of nodes.
     *
     * @param oldNodes - The original nodes
     * @param newNodes - The new nodes
     * @returns A 2D matrix for LCS calculation
     */
    buildLCSMatrix(oldNodes, newNodes) {
        const matrix = Array(oldNodes.length + 1)
            .fill(0)
            .map(() => Array(newNodes.length + 1).fill(0));
        for (let i = 1; i <= oldNodes.length; i++) {
            for (let j = 1; j <= newNodes.length; j++) {
                if (this.areNodesEqual(oldNodes[i - 1], newNodes[j - 1])) {
                    matrix[i][j] = matrix[i - 1][j - 1] + 1;
                }
                else {
                    matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
                }
            }
        }
        return matrix;
    }
    /**
     * Extracts matched pairs of indices from an LCS matrix.
     *
     * @param matrix - The LCS matrix
     * @param oldNodes - The original nodes
     * @param newNodes - The new nodes
     * @returns An array of [oldIndex, newIndex] pairs
     */
    extractMatchedPairs(matrix, oldNodes, newNodes) {
        const pairs = [];
        let i = oldNodes.length;
        let j = newNodes.length;
        while (i > 0 && j > 0) {
            if (this.areNodesEqual(oldNodes[i - 1], newNodes[j - 1])) {
                pairs.push([i - 1, j - 1]);
                i--;
                j--;
            }
            else if (matrix[i - 1][j] >= matrix[i][j - 1]) {
                i--;
            }
            else {
                j--;
            }
        }
        return pairs.reverse();
    }
    /**
     * Determines if two nodes are considered equal for matching purposes.
     *
     * @param oldNode - The original node
     * @param newNode - The new node
     * @returns Whether the nodes are considered equal
     */
    areNodesEqual(oldNode, newNode) {
        var _a, _b;
        if (oldNode.type !== newNode.type)
            return false;
        // For text nodes, compare content
        if (oldNode.type === 'Text' && newNode.type === 'Text') {
            const oldText = this.options.ignoreWhitespace
                ? (oldNode.value || '').trim()
                : (oldNode.value || '');
            const newText = this.options.ignoreWhitespace
                ? (newNode.value || '').trim()
                : (newNode.value || '');
            if (this.options.ignoreCase) {
                return oldText.toLowerCase() === newText.toLowerCase();
            }
            return oldText === newText;
        }
        // For element nodes, compare tag name and main attributes
        if (oldNode.name !== newNode.name)
            return false;
        // Check for class and id matches as heuristic
        const importantAttrs = ['id', 'class'];
        for (const attr of importantAttrs) {
            const oldValue = (_a = oldNode.attributes) === null || _a === void 0 ? void 0 : _a.get(attr);
            const newValue = (_b = newNode.attributes) === null || _b === void 0 ? void 0 : _b.get(attr);
            if (oldValue !== newValue)
                return false;
        }
        return true;
    }
    /**
     * Optimizes an array of diffs to reduce redundancy and improve efficiency.
     *
     * @param diffs - The array of diffs to optimize
     * @returns An optimized array of diffs
     */
    optimizeDiffs(diffs) {
        // Sort diffs by path depth (deeper paths first)
        diffs.sort((a, b) => b.path.length - a.path.length);
        // Eliminate redundant operations
        const optimized = [];
        const processedPaths = new Set();
        for (const diff of diffs) {
            const pathStr = diff.path.join('.');
            // Skip if we've already processed this path with a higher-priority operation
            if (processedPaths.has(pathStr))
                continue;
            // Skip updates to nodes that will be removed or replaced
            const parentPath = diff.path.slice(0, -1).join('.');
            if (processedPaths.has(parentPath) && diff.type !== 'REMOVE')
                continue;
            // Add this diff and mark path as processed
            optimized.push(diff);
            processedPaths.add(pathStr);
            // For removals and replacements, mark all child paths as processed
            if (diff.type === 'REMOVE' || diff.type === 'REPLACE') {
                this.markChildPathsAsProcessed(diff.path, processedPaths);
            }
        }
        // Re-sort by operation type and path
        return this.sortDiffsByOperationOrder(optimized);
    }
    /**
     * Marks all child paths of a given path as processed.
     *
     * @param path - The parent path
     * @param processedPaths - The set of processed paths to update
     */
    markChildPathsAsProcessed(path, processedPaths) {
        const pathStr = path.join('.');
        for (const processed of Array.from(processedPaths)) {
            if (processed.startsWith(pathStr + '.')) {
                processedPaths.delete(processed);
            }
        }
    }
    /**
     * Sorts diffs by operation order to ensure correct application.
     *
     * @param diffs - The diffs to sort
     * @returns Sorted diffs
     */
    sortDiffsByOperationOrder(diffs) {
        // Define operation priorities
        const priorities = {
            'REMOVE': 0,
            'MOVE': 1,
            'REPLACE': 2,
            'UPDATE': 3,
            'ADD': 4
        };
        return diffs.sort((a, b) => {
            // First sort by operation type
            const priorityDiff = priorities[a.type] - priorities[b.type];
            if (priorityDiff !== 0)
                return priorityDiff;
            // Then by path depth (shallower first, except for ADD operations)
            if (a.type === 'ADD' && b.type === 'ADD') {
                return a.path.length - b.path.length;
            }
            // Compare path arrays lexicographically
            for (let i = 0; i < Math.min(a.path.length, b.path.length); i++) {
                if (a.path[i] !== b.path[i]) {
                    return a.path[i] - b.path[i];
                }
            }
            return a.path.length - b.path.length;
        });
    }
    /**
     * Creates a deep clone of a node.
     *
     * @param node - The node to clone
     * @returns A cloned copy of the node
     */
    cloneNode(node) {
        const clone = {
            type: node.type,
            children: [],
            metadata: { ...node.metadata }
        };
        if (node.name)
            clone.name = node.name;
        if (node.value)
            clone.value = node.value;
        if (node.attributes) {
            clone.attributes = new Map(node.attributes);
        }
        if (node.children) {
            clone.children = node.children.map(child => this.cloneNode(child));
        }
        return clone;
    }
    /**
     * Generates DOM patches from computed differences.
     *
     * @param diffs - The array of differences
     * @returns An array of patches that can be applied to the DOM
     */
    generatePatches(diffs) {
        return diffs.map(diff => {
            switch (diff.type) {
                case 'ADD':
                    return {
                        type: 'CREATE',
                        path: diff.path,
                        node: diff.node
                    };
                case 'REMOVE':
                    return {
                        type: 'REMOVE',
                        path: diff.path
                    };
                case 'REPLACE':
                    return {
                        type: 'REPLACE',
                        path: diff.path,
                        node: diff.node
                    };
                case 'UPDATE':
                    return {
                        type: 'UPDATE',
                        path: diff.path,
                        attributes: diff.changes
                    };
                case 'MOVE':
                    return {
                        type: 'MOVE',
                        path: diff.path,
                        from: diff.from,
                        to: diff.to
                    };
                default:
                    throw new Error(`Unknown diff type: ${diff.type}`);
            }
        });
    }
    /**
     * Applies patches to a DOM node to transform it.
     *
     * @param domNode - The DOM node to patch
     * @param patches - The patches to apply
     * @returns The patched DOM node
     */
    patch(domNode, patches) {
        let currentNode = domNode;
        for (const patch of patches) {
            currentNode = this.applyPatch(currentNode, patch);
        }
        return currentNode;
    }
    /**
     * Applies a single patch to a DOM node.
     *
     * @param node - The DOM node to patch
     * @param patch - The patch to apply
     * @returns The patched DOM node
     */
    applyPatch(node, patch) {
        const targetNode = this.findNodeByPath(node, patch.path);
        if (!targetNode) {
            console.warn(`Could not find node at path: ${patch.path.join('.')}`);
            return node;
        }
        switch (patch.type) {
            case 'CREATE':
                if (patch.node) {
                    this.createNode(targetNode, patch.node);
                }
                break;
            case 'UPDATE':
                if (patch.attributes) {
                    this.updateNodeAttributes(targetNode, patch.attributes);
                }
                break;
            case 'REPLACE':
                if (patch.node) {
                    this.replaceNode(targetNode, patch.node);
                }
                break;
            case 'REMOVE':
                this.removeNode(targetNode);
                break;
            case 'MOVE':
                if (patch.from && patch.to) {
                    this.moveNode(node, patch.from, patch.to);
                }
                break;
        }
        return node;
    }
    /**
     * Finds a node by its path in the tree.
     *
     * @param root - The root node
     * @param path - The path to the target node
     * @returns The target node or undefined if not found
     */
    findNodeByPath(root, path) {
        let current = root;
        for (let i = 0; i < path.length; i++) {
            const index = path[i];
            if (!current.children || index >= current.children.length) {
                return undefined;
            }
            current = current.children[index];
        }
        return current;
    }
    /**
     * Creates a new node as a child of the target node.
     *
     * @param parent - The parent node
     * @param newNode - The node to create
     */
    createNode(parent, newNode) {
        if (!parent.children) {
            parent.children = [];
        }
        parent.children.push(this.cloneNode(newNode));
    }
    /**
     * Updates a node's attributes.
     *
     * @param node - The node to update
     * @param attributes - The attributes to update
     */
    updateNodeAttributes(node, attributes) {
        if (!node.attributes) {
            node.attributes = new Map();
        }
        for (const [key, value] of Object.entries(attributes)) {
            if (value === null) {
                node.attributes.delete(key);
            }
            else {
                node.attributes.set(key, value);
            }
        }
    }
    /**
     * Replaces a node with a new node.
     *
     * @param oldNode - The node to replace
     * @param newNode - The replacement node
     */
    replaceNode(oldNode, newNode) {
        Object.assign(oldNode, this.cloneNode(newNode));
    }
    /**
     * Removes a node from its parent.
     *
     * @param node - The node to remove
     */
    removeNode(node) {
        const parent = this.findParentNode(node);
        if (parent && parent.children) {
            const index = parent.children.indexOf(node);
            if (index !== -1) {
                parent.children.splice(index, 1);
            }
        }
    }
    /**
     * Moves a node from one position to another.
     *
     * @param root - The root node
     * @param fromPath - The source path
     * @param toPath - The destination path
     */
    moveNode(root, fromPath, toPath) {
        const sourceNode = this.findNodeByPath(root, fromPath);
        const targetParent = this.findNodeByPath(root, toPath.slice(0, -1));
        if (!sourceNode || !targetParent)
            return;
        // Remove from source
        this.removeNode(sourceNode);
        // Add to target
        if (!targetParent.children) {
            targetParent.children = [];
        }
        const targetIndex = toPath[toPath.length - 1];
        targetParent.children.splice(targetIndex, 0, sourceNode);
    }
    /**
     * Finds the parent node of a given node.
     *
     * @param node - The node to find the parent of
     * @returns The parent node or undefined if not found
     */
    findParentNode(node) {
        // Start searching from the root (assuming we have access to it)
        // This is a limitation - in a real implementation, nodes should
        // have parent references or we'd need to keep track of the full tree
        return undefined; // Placeholder - can't implement without additional context
    }
}

/**
 * Base class for virtual DOM nodes
 */
class VNodeBase {
}
/**
 * A virtual DOM node for HTML elements
 */
class HTMLVNode extends VNodeBase {
    /**
     * Creates a new HTML virtual node
     *
     * @param type - The node type
     * @param props - Node properties
     * @param children - Child nodes
     * @param key - Optional key for efficient diffing
     */
    constructor(type, props = {}, children = [], key) {
        super();
        this.type = type;
        this.props = Object.freeze({ ...props });
        this.children = Object.freeze([...children]);
        this.key = key;
        this.state = {
            id: HTMLVNode.nodeCounter++,
            transitions: new Map(),
            isMinimized: false,
            equivalenceClass: null
        };
    }
    /**
     * Creates a text node
     *
     * @param content - The text content
     */
    static createText(content) {
        return new HTMLVNode('#text', { textContent: content });
    }
    /**
     * Creates an element node
     *
     * @param type - The element type
     * @param props - Element properties
     * @param children - Child elements or strings
     */
    static createElement(type, props = {}, ...children) {
        const processedChildren = children.reduce((acc, child) => {
            if (Array.isArray(child)) {
                acc.push(...child.map(c => typeof c === 'string' ? HTMLVNode.createText(c) : c));
            }
            else {
                acc.push(typeof child === 'string' ? HTMLVNode.createText(child) : child);
            }
            return acc;
        }, []);
        return new HTMLVNode(type, props, processedChildren);
    }
    /**
     * Clones this node with optional new props and children
     *
     * @param props - New props to apply
     * @param children - New children
     */
    clone(props = {}, children = this.children) {
        return new HTMLVNode(this.type, { ...this.props, ...props }, children, this.key);
    }
    /**
     * Checks if another node equals this one
     *
     * @param other - The node to compare with
     */
    equals(other) {
        if (!(other instanceof HTMLVNode))
            return false;
        return (this.type === other.type &&
            this.key === other.key &&
            this.compareProps(other.props) &&
            this.compareChildren(other.children));
    }
    /**
     * Compares props with another node's props
     *
     * @param otherProps - The props to compare with
     */
    compareProps(otherProps) {
        const thisKeys = Object.keys(this.props);
        const otherKeys = Object.keys(otherProps);
        if (thisKeys.length !== otherKeys.length)
            return false;
        return thisKeys.every(key => this.props[key] === otherProps[key]);
    }
    /**
     * Compares children with another node's children
     *
     * @param otherChildren - The children to compare with
     */
    compareChildren(otherChildren) {
        if (this.children.length !== otherChildren.length)
            return false;
        return this.children.every((child, index) => child.equals(otherChildren[index]));
    }
    /**
     * Generates a state signature for this node
     */
    getStateSignature() {
        var _a;
        const components = [
            this.type,
            ((_a = this.key) === null || _a === void 0 ? void 0 : _a.toString()) || '',
            Object.keys(this.props).sort().join(','),
            this.children.map(child => child.state.id).join(',')
        ];
        return components.join('|');
    }
    /**
     * Sets a DOM attribute
     *
     * @param element - The element to set the attribute on
     * @param key - The attribute key
     * @param value - The attribute value
     */
    setDOMAttribute(element, key, value) {
        if (value === null || value === undefined) {
            element.removeAttribute(key);
            return;
        }
        if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
            return;
        }
        if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
            return;
        }
        if (key === 'className') {
            element.className = value;
            return;
        }
        if (typeof value === 'boolean') {
            if (value) {
                element.setAttribute(key, '');
            }
            else {
                element.removeAttribute(key);
            }
            if (key in element) {
                element[key] = value;
            }
            return;
        }
        element.setAttribute(key, value.toString());
        if (key in element) {
            element[key] = value;
        }
    }
    /**
     * Converts this virtual node to a DOM node
     */
    toDOM() {
        if (this.type === '#text') {
            return document.createTextNode(this.props.textContent || '');
        }
        const element = document.createElement(this.type);
        Object.entries(this.props).forEach(([key, value]) => {
            this.setDOMAttribute(element, key, value);
        });
        this.children.forEach(child => {
            element.appendChild(child.toDOM());
        });
        return element;
    }
    /**
     * Minimizes this node's state by computing equivalence
     */
    minimizeState() {
        const signature = this.getStateSignature();
        const staticNodeMap = HTMLVNode.getStaticNodeMap();
        if (!staticNodeMap.has(signature)) {
            staticNodeMap.set(signature, staticNodeMap.size);
        }
        this.state.equivalenceClass = staticNodeMap.get(signature);
        this.state.isMinimized = true;
        // Recursively minimize children
        this.children.forEach(child => {
            if (!child.state.isMinimized) {
                child.minimizeState();
            }
        });
    }
    static getStaticNodeMap() {
        if (!HTMLVNode._signatureMap) {
            HTMLVNode._signatureMap = new Map();
        }
        return HTMLVNode._signatureMap;
    }
    /**
     * Creates an HTMLVNode from an HTML string
     *
     * @param html - The HTML string to parse
     */
    static fromHTML(html) {
        // This is a simplified implementation that should be replaced with proper parsing
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        const el = template.content.firstChild;
        if (!el) {
            return HTMLVNode.createText('');
        }
        return HTMLVNode.fromDOM(el);
    }
    /**
     * Creates an HTMLVNode from a DOM element
     *
     * @param element - The DOM element to convert
     */
    static fromDOM(element) {
        // Handle text nodes
        if (element.nodeType === Node.TEXT_NODE) {
            return HTMLVNode.createText(element.textContent || '');
        }
        // Handle element nodes
        if (element.nodeType === Node.ELEMENT_NODE) {
            const el = element;
            const props = {};
            // Process attributes
            Array.from(el.attributes).forEach(attr => {
                if (attr.name === 'class') {
                    props.className = attr.value;
                }
                else if (attr.name === 'style') {
                    // Parse inline styles
                    const styleObj = {};
                    attr.value.split(';').forEach(rule => {
                        const [key, value] = rule.split(':').map(s => s.trim());
                        if (key && value) {
                            styleObj[key] = value;
                        }
                    });
                    props.style = styleObj;
                }
                else {
                    props[attr.name] = attr.value;
                }
            });
            // Process children
            const children = Array.from(el.childNodes).map(child => HTMLVNode.fromDOM(child));
            return new HTMLVNode(el.nodeName.toLowerCase(), props, children);
        }
        // Fallback for other node types
        return HTMLVNode.createText('');
    }
    /**
     * Flattens nested arrays of nodes into a single array
     *
     * @param children - The children to flatten
     */
    static flatten(children) {
        return children.reduce((acc, child) => {
            if (child === null || child === undefined) {
                return acc;
            }
            if (Array.isArray(child)) {
                acc.push(...HTMLVNode.flatten(child));
            }
            else if (typeof child === 'string') {
                acc.push(HTMLVNode.createText(child));
            }
            else {
                acc.push(child);
            }
            return acc;
        }, []);
    }
    /**
     * Performs a depth-first traversal of the virtual DOM tree
     *
     * @param callback - The callback to run for each node
     */
    traverse(callback) {
        callback(this);
        this.children.forEach(child => child.traverse(callback));
    }
    /**
     * Updates this node's props and returns a new node
     *
     * @param props - The new props to apply
     */
    updateProps(props) {
        return new HTMLVNode(this.type, { ...this.props, ...props }, this.children, this.key);
    }
    /**
     * Updates this node's children and returns a new node
     *
     * @param newChildren - The new children to use
     */
    updateChildren(newChildren) {
        return new HTMLVNode(this.type, this.props, newChildren, this.key);
    }
    /**
     * Creates an optimized HTML string from this virtual DOM tree
     */
    toHTML() {
        if (this.type === '#text') {
            return this.props.textContent || '';
        }
        const attributeString = Object.entries(this.props)
            .filter(([key, value]) => key !== 'children' &&
            key !== 'textContent' &&
            value !== null &&
            value !== undefined)
            .map(([key, value]) => {
            if (key === 'className') {
                return `class="${value}"`;
            }
            if (key === 'style' && typeof value === 'object') {
                const styleString = Object.entries(value)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('; ');
                return `style="${styleString}"`;
            }
            if (typeof value === 'boolean') {
                return value ? key : '';
            }
            return `${key}="${String(value).replace(/"/g, '&quot;')}"`;
        })
            .filter(Boolean)
            .join(' ');
        const openTag = attributeString.length > 0
            ? `<${this.type} ${attributeString}>`
            : `<${this.type}>`;
        // Handle self-closing tags
        const selfClosingTags = [
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        ];
        if (selfClosingTags.includes(this.type) && this.children.length === 0) {
            return openTag.replace(/>$/, ' />');
        }
        const childrenHTML = this.children.map(child => child.toHTML()).join('');
        return `${openTag}${childrenHTML}</${this.type}>`;
    }
    /**
     * Checks if this node matches a selector
     * This is a simplified implementation that only supports tag and class selectors
     *
     * @param selector - The selector to match against
     */
    matches(selector) {
        // Match tag name
        if (selector === this.type) {
            return true;
        }
        // Match class name
        if (selector.startsWith('.') && this.props.className) {
            const classes = this.props.className.split(' ');
            return classes.includes(selector.substring(1));
        }
        // Match ID
        if (selector.startsWith('#') && this.props.id) {
            return this.props.id === selector.substring(1);
        }
        return false;
    }
    /**
     * Finds the first node that matches a selector
     *
     * @param selector - The selector to match against
     */
    querySelector(selector) {
        if (this.matches(selector)) {
            return this;
        }
        for (const child of this.children) {
            const match = child.querySelector(selector);
            if (match) {
                return match;
            }
        }
        return null;
    }
    /**
     * Finds all nodes that match a selector
     *
     * @param selector - The selector to match against
     */
    querySelectorAll(selector) {
        const results = [];
        if (this.matches(selector)) {
            results.push(this);
        }
        for (const child of this.children) {
            results.push(...child.querySelectorAll(selector));
        }
        return results;
    }
}
HTMLVNode.nodeCounter = 0;
/**
 * Gets the static node map for signature tracking
 * This map is used to track equivalence classes across all nodes
 */
HTMLVNode._signatureMap = null;

/**
 * DomASM Main API
 *
 * Provides a unified interface to the DOM ASM functionality,
 * including parsing, optimization, diffing, patching, and rendering.
 */
class DomASM {
    constructor() {
        this.parser = new HTMLParser();
        this.optimizer = new HTMLAstOptimizer();
        this.diffPatcher = new DiffPatchEngine();
    }
    parse(input) {
        return this.parser.parse(input);
    }
    optimize(ast, _options) {
        return this.optimizer.optimize(ast);
    }
    diff(oldAst, newAst) {
        return this.diffPatcher.diff(oldAst, newAst);
    }
    patch(ast, patches) {
        return this.diffPatcher.patch(ast.root, this.diffPatcher.generatePatches(patches));
    }
    render(ast) {
        return this.convertToVNode(ast.root).toDOM();
    }
    convertToVNode(node) {
        if (node.type === 'Text') {
            return HTMLVNode.createText(node.value || '');
        }
        const props = {};
        if (node.attributes) {
            node.attributes.forEach((value, key) => {
                props[key] = value;
            });
        }
        const children = (node.children || []).map((child) => this.convertToVNode(child));
        return new HTMLVNode(node.name || node.type, props, children);
    }
    process(input) {
        const ast = this.parse(input);
        const optimizedAst = this.optimize(ast);
        return this.render(optimizedAst);
    }
    updateDOM(domNode, newHTML) {
        const oldVNode = HTMLVNode.fromDOM(domNode);
        const ast = this.parse(newHTML);
        const optimizedAst = this.optimize(ast);
        const newVNode = this.convertToVNode(optimizedAst.root);
        const diffs = this.diffVNodes(oldVNode, newVNode);
        const patches = this.generateVNodePatches(diffs);
        return this.applyVNodePatches(domNode, patches);
    }
    diffVNodes(oldNode, newNode) {
        const oldAst = { root: this.convertToASTNode(oldNode), metadata: {} };
        const newAst = { root: this.convertToASTNode(newNode), metadata: {} };
        return this.diffPatcher.diff(oldAst, newAst);
    }
    convertToASTNode(vnode) {
        const node = {
            type: vnode.type === '#text' ? 'Text' : 'Element',
            children: []
        };
        if (vnode.type !== '#text') {
            node.name = vnode.type;
        }
        if (vnode.type === '#text') {
            node.value = vnode.props.textContent || '';
        }
        else {
            const attributes = new Map();
            Object.entries(vnode.props).forEach(([key, value]) => {
                if (key !== 'children' && key !== 'textContent') {
                    attributes.set(key, String(value));
                }
            });
            node.attributes = attributes;
        }
        node.children = vnode.children.map((child) => this.convertToASTNode(child));
        return node;
    }
    generateVNodePatches(diffs) {
        return this.diffPatcher.generatePatches(diffs);
    }
    applyVNodePatches(domNode, patches) {
        const astNode = this.convertToASTNode(HTMLVNode.fromDOM(domNode));
        const patchedNode = this.diffPatcher.patch(astNode, patches);
        return this.convertToVNode(patchedNode).toDOM();
    }
}

const pkg = { version: '0.1.0' };
const program = new commander.Command();
program
    .name('domasm')
    .description('DOM ASM - Document Object Model Automaton State Machine CLI')
    .version(pkg.version);
program
    .command('parse <file>')
    .description('Parse an HTML file into an AST and output as JSON')
    .option('-o, --output <file>', 'Output file path')
    .option('--optimize', 'Optimize the AST after parsing')
    .action(async (file, options) => {
    try {
        const input = fs__namespace.readFileSync(path__namespace.resolve(file), 'utf-8');
        const domasm = new DomASM();
        let ast = domasm.parse(input);
        if (options.optimize) {
            ast = domasm.optimize(ast);
        }
        const output = JSON.stringify(ast, null, 2);
        if (options.output) {
            fs__namespace.writeFileSync(path__namespace.resolve(options.output), output, 'utf-8');
            console.log(`AST written to ${options.output}`);
        }
        else {
            console.log(output);
        }
    }
    catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('optimize <file>')
    .description('Parse and optimize an HTML file AST')
    .option('-o, --output <file>', 'Output file path')
    .action(async (file, options) => {
    try {
        const input = fs__namespace.readFileSync(path__namespace.resolve(file), 'utf-8');
        const domasm = new DomASM();
        const ast = domasm.parse(input);
        const optimized = domasm.optimize(ast);
        const output = JSON.stringify(optimized, null, 2);
        if (options.output) {
            fs__namespace.writeFileSync(path__namespace.resolve(options.output), output, 'utf-8');
            console.log(`Optimized AST written to ${options.output}`);
        }
        else {
            console.log(output);
        }
    }
    catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('diff <file1> <file2>')
    .description('Compute differences between two HTML files')
    .option('-o, --output <file>', 'Output file path')
    .action(async (file1, file2, options) => {
    try {
        const input1 = fs__namespace.readFileSync(path__namespace.resolve(file1), 'utf-8');
        const input2 = fs__namespace.readFileSync(path__namespace.resolve(file2), 'utf-8');
        const domasm = new DomASM();
        const ast1 = domasm.parse(input1);
        const ast2 = domasm.parse(input2);
        const diffs = domasm.diff(ast1, ast2);
        const output = JSON.stringify(diffs, null, 2);
        if (options.output) {
            fs__namespace.writeFileSync(path__namespace.resolve(options.output), output, 'utf-8');
            console.log(`Diff written to ${options.output}`);
        }
        else {
            console.log(output);
        }
    }
    catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
});
program.parse(process.argv);
//# sourceMappingURL=domasm-cli.js.map
