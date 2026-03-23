/*!
 * @obinexusltd/dom-asm v0.1.0
 * (c) 2025 Nnamdi Michael Okpala
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Enum-like object defining CSS token types
 */
const CSSTokenType = {
    // Structure tokens
    StartBlock: 'StartBlock',
    EndBlock: 'EndBlock',
    Semicolon: 'Semicolon',
    Colon: 'Colon',
    Comma: 'Comma',
    // Selector tokens
    Selector: 'Selector',
    PseudoClass: 'PseudoClass',
    PseudoElement: 'PseudoElement',
    Combinator: 'Combinator',
    // Property and value tokens
    Property: 'Property',
    Value: 'Value',
    Unit: 'Unit',
    Number: 'Number',
    Color: 'Color',
    URL: 'URL',
    String: 'String',
    // Function tokens
    Function: 'Function',
    OpenParen: 'OpenParen',
    CloseParen: 'CloseParen',
    // Special tokens
    AtKeyword: 'AtKeyword',
    Comment: 'Comment',
    Whitespace: 'Whitespace',
    EOF: 'EOF',
    // Meta tokens for state tracking
    Error: 'Error' // Invalid token
};

/**
 * CSS Token with support for state minimization
 */
class CSSToken {
    /**
     * Creates a new CSS token with state minimization capabilities
     */
    constructor(type, value, position, metadata = {}) {
        this.validateType(type);
        this.validatePosition(position);
        this.type = type;
        this.value = value;
        this.position = position;
        this.metadata = {
            ...metadata,
            stateSignature: metadata.stateSignature || undefined,
            equivalenceClass: metadata.equivalenceClass || null,
            transitions: metadata.transitions || new Map()
        };
        Object.freeze(this);
    }
    /**
     * Validates the token type
     */
    validateType(type) {
        if (!Object.values(CSSTokenType).includes(type)) {
            throw new TypeError(`Invalid token type: ${type}`);
        }
    }
    /**
     * Validates the position information
     */
    validatePosition(position) {
        if (!position ||
            typeof position.line !== 'number' ||
            typeof position.column !== 'number' ||
            position.line < 1 ||
            position.column < 1) {
            throw new TypeError('Invalid position object. Must have line and column numbers >= 1');
        }
    }
    /**
     * Computes a state signature for this token based on its transitions
     * Used for state minimization
     */
    computeStateSignature() {
        const components = [
            this.type,
            this.getTransitionsSignature(),
            this.getMetadataSignature()
        ];
        const signature = components.join('|');
        // Create a new token with the updated signature
        return signature;
    }
    /**
     * Gets a signature for transitions
     */
    getTransitionsSignature() {
        const transitions = this.metadata.transitions;
        if (!transitions)
            return '';
        return Array.from(transitions.entries())
            .map(([symbol, target]) => `${symbol}->${target.type}`)
            .sort()
            .join(',');
    }
    /**
     * Gets a signature for metadata
     */
    getMetadataSignature() {
        const relevantMetadata = {
            equivalenceClass: this.metadata.equivalenceClass
        };
        return JSON.stringify(relevantMetadata);
    }
    /**
     * Adds a transition to the token and returns a new token
     */
    addTransition(symbol, targetToken) {
        if (!(targetToken instanceof CSSToken)) {
            throw new TypeError('Target must be a CSSToken instance');
        }
        // Create a new token with updated transitions
        const newTransitions = new Map(this.metadata.transitions);
        newTransitions.set(symbol, targetToken);
        return new CSSToken(this.type, this.value, this.position, {
            ...this.metadata,
            transitions: newTransitions
        });
    }
    /**
     * Sets an equivalence class for the token and returns a new token
     */
    setEquivalenceClass(classId) {
        return new CSSToken(this.type, this.value, this.position, {
            ...this.metadata,
            equivalenceClass: classId
        });
    }
    /**
     * Checks if this token equals another token
     */
    equals(other) {
        if (!(other instanceof CSSToken))
            return false;
        return this.type === other.type &&
            this.value === other.value &&
            this.position.line === other.position.line &&
            this.position.column === other.position.column;
    }
    /**
     * Checks if this token is of any of the specified types
     */
    isTypeOf(...types) {
        return types.includes(this.type);
    }
    /**
     * Returns a string representation of this token
     */
    toString() {
        return `${this.type}(${JSON.stringify(this.value)}) at ${this.position.line}:${this.position.column}`;
    }
    /**
     * Factory method for creating an EOF token
     */
    static createEOF(position) {
        return new CSSToken(CSSTokenType.EOF, '', position);
    }
    /**
     * Factory method for creating an error token
     */
    static createError(message, position) {
        return new CSSToken(CSSTokenType.Error, message, position);
    }
    /**
     * Factory method for creating a whitespace token
     */
    static createWhitespace(value, position) {
        return new CSSToken(CSSTokenType.Whitespace, value, position);
    }
    /**
     * Checks if two tokens are equivalent for state minimization
     */
    static areEquivalent(token1, token2) {
        var _a, _b;
        if (!(token1 instanceof CSSToken) || !(token2 instanceof CSSToken)) {
            return false;
        }
        // Compare basic properties
        if (token1.type !== token2.type)
            return false;
        // Compare transitions
        const transitions1 = Array.from(((_a = token1.metadata.transitions) === null || _a === void 0 ? void 0 : _a.entries()) || []).sort();
        const transitions2 = Array.from(((_b = token2.metadata.transitions) === null || _b === void 0 ? void 0 : _b.entries()) || []).sort();
        if (transitions1.length !== transitions2.length)
            return false;
        for (let i = 0; i < transitions1.length; i++) {
            const [symbol1, target1] = transitions1[i];
            const [symbol2, target2] = transitions2[i];
            if (symbol1 !== symbol2 || !target1.equals(target2)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Computes equivalence classes for a set of tokens
     * This is a key part of the state minimization algorithm
     */
    static computeEquivalenceClasses(tokens) {
        const classes = new Map();
        let nextClassId = 0;
        for (const token of tokens) {
            let found = false;
            for (const [classId, representatives] of classes) {
                if (representatives.some(rep => CSSToken.areEquivalent(rep, token))) {
                    // Set the equivalence class on the token
                    token.metadata.equivalenceClass = classId;
                    representatives.push(token);
                    found = true;
                    break;
                }
            }
            if (!found) {
                // Create a new equivalence class
                const newClassId = nextClassId++;
                token.metadata.equivalenceClass = newClassId;
                classes.set(newClassId, [token]);
            }
        }
        return classes;
    }
}

/**
 * CSS Tokenizer with support for state minimization
 * Breaks CSS into tokens that can be used for parsing and AST building
 */
class CSSTokenizer {
    /**
     * Creates a new CSS tokenizer
     */
    constructor(input, options = {}) {
        this.input = input;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.errors = [];
        this.options = {
            preserveWhitespace: false,
            recognizeColors: true,
            recognizeFunctions: true,
            generateStateTransitions: true,
            ...options
        };
    }
    /**
     * Tokenizes the input CSS string
     */
    tokenize() {
        while (this.position < this.input.length) {
            const char = this.peek();
            if (this.isWhitespace(char)) {
                this.tokenizeWhitespace();
            }
            else if (char === '/' && this.peek(1) === '*') {
                this.tokenizeComment();
            }
            else if (char === '@') {
                this.tokenizeAtKeyword();
            }
            else if (char === '#') {
                this.tokenizeHash();
            }
            else if (this.isNumberStart(char)) {
                this.tokenizeNumber();
            }
            else if (char === '"' || char === "'") {
                this.tokenizeString();
            }
            else if (this.isIdentStart(char)) {
                this.tokenizeIdentifier();
            }
            else if (this.isStructuralChar(char)) {
                this.tokenizeStructural();
            }
            else {
                this.addError(`Unexpected character: ${char}`);
                this.advance();
            }
        }
        // Add EOF token
        this.tokens.push(CSSToken.createEOF(this.getPosition()));
        // Generate state transitions if requested
        if (this.options.generateStateTransitions) {
            this.generateStateTransitions();
        }
        // Compute equivalence classes if we generated transitions
        if (this.options.generateStateTransitions) {
            this.computeEquivalenceClasses();
        }
        return {
            tokens: this.tokens,
            errors: this.errors
        };
    }
    /**
     * Tokenizes whitespace
     */
    tokenizeWhitespace() {
        const start = this.getPosition();
        let value = '';
        while (this.position < this.input.length && this.isWhitespace(this.peek())) {
            value += this.advance();
        }
        if (this.options.preserveWhitespace) {
            this.tokens.push(CSSToken.createWhitespace(value, start));
        }
    }
    /**
     * Tokenizes a comment
     */
    tokenizeComment() {
        const start = this.getPosition();
        let value = '';
        // Skip /*
        this.advance();
        this.advance();
        while (this.position < this.input.length) {
            if (this.peek() === '*' && this.peek(1) === '/') {
                this.advance(); // Skip *
                this.advance(); // Skip /
                break;
            }
            value += this.advance();
        }
        this.tokens.push(new CSSToken(CSSTokenType.Comment, value, start));
    }
    /**
     * Tokenizes an at-keyword
     */
    tokenizeAtKeyword() {
        const start = this.getPosition();
        this.advance(); // Skip @
        let value = '';
        while (this.position < this.input.length && this.isIdentChar(this.peek())) {
            value += this.advance();
        }
        this.tokens.push(new CSSToken(CSSTokenType.AtKeyword, value, start));
    }
    /**
     * Tokenizes a hash (id selector or color)
     */
    tokenizeHash() {
        const start = this.getPosition();
        this.advance(); // Skip #
        let value = '';
        while (this.position < this.input.length && this.isIdentChar(this.peek())) {
            value += this.advance();
        }
        // Check if it's a valid color
        if (this.options.recognizeColors && this.isValidColor(value)) {
            this.tokens.push(new CSSToken(CSSTokenType.Color, '#' + value, start));
        }
        else {
            this.tokens.push(new CSSToken(CSSTokenType.Selector, '#' + value, start));
        }
    }
    /**
     * Tokenizes a number and optional unit
     */
    tokenizeNumber() {
        const start = this.getPosition();
        let value = '';
        // Handle sign
        if (this.peek() === '+' || this.peek() === '-') {
            value += this.advance();
        }
        // Handle digits before decimal
        while (this.position < this.input.length && this.isDigit(this.peek())) {
            value += this.advance();
        }
        // Handle decimal point and digits after
        if (this.peek() === '.') {
            value += this.advance();
            while (this.position < this.input.length && this.isDigit(this.peek())) {
                value += this.advance();
            }
        }
        // Check for unit
        let unit = '';
        if (this.isIdentStart(this.peek())) {
            while (this.position < this.input.length && this.isIdentChar(this.peek())) {
                unit += this.advance();
            }
        }
        if (unit) {
            this.tokens.push(new CSSToken(CSSTokenType.Number, parseFloat(value), start));
            this.tokens.push(new CSSToken(CSSTokenType.Unit, unit, this.getPosition()));
        }
        else {
            this.tokens.push(new CSSToken(CSSTokenType.Number, parseFloat(value), start));
        }
    }
    /**
     * Tokenizes a string
     */
    tokenizeString() {
        const start = this.getPosition();
        const quote = this.advance();
        let value = '';
        while (this.position < this.input.length) {
            const char = this.peek();
            if (char === quote) {
                this.advance();
                break;
            }
            else if (char === '\\') {
                this.advance();
                if (this.position < this.input.length) {
                    value += this.advance();
                }
            }
            else {
                value += this.advance();
            }
        }
        this.tokens.push(new CSSToken(CSSTokenType.String, value, start));
    }
    /**
     * Tokenizes an identifier (property, selector, or function)
     */
    tokenizeIdentifier() {
        const start = this.getPosition();
        let value = '';
        while (this.position < this.input.length && this.isIdentChar(this.peek())) {
            value += this.advance();
        }
        // Check if it's a function
        if (this.peek() === '(' && this.options.recognizeFunctions) {
            this.advance(); // Skip (
            this.tokens.push(new CSSToken(CSSTokenType.Function, value, start));
            this.tokens.push(new CSSToken(CSSTokenType.OpenParen, '(', this.getPosition()));
            return;
        }
        // Check for property or value context
        const lastToken = this.tokens[this.tokens.length - 1];
        if (lastToken && lastToken.type === CSSTokenType.Colon) {
            // After a colon, this is a value
            this.tokens.push(new CSSToken(CSSTokenType.Value, value, start));
        }
        else {
            // Otherwise, it's a property or selector
            // In a more complex tokenizer, we'd have more logic to determine which
            // For now, we're assuming it's a property
            this.tokens.push(new CSSToken(CSSTokenType.Property, value, start));
        }
    }
    /**
     * Tokenizes structural characters like {, }, :, ;, etc.
     */
    tokenizeStructural() {
        const char = this.advance();
        const position = this.getPosition();
        switch (char) {
            case '{':
                this.tokens.push(new CSSToken(CSSTokenType.StartBlock, char, position));
                break;
            case '}':
                this.tokens.push(new CSSToken(CSSTokenType.EndBlock, char, position));
                break;
            case ':':
                this.tokens.push(new CSSToken(CSSTokenType.Colon, char, position));
                break;
            case ';':
                this.tokens.push(new CSSToken(CSSTokenType.Semicolon, char, position));
                break;
            case ',':
                this.tokens.push(new CSSToken(CSSTokenType.Comma, char, position));
                break;
            case '(':
                this.tokens.push(new CSSToken(CSSTokenType.OpenParen, char, position));
                break;
            case ')':
                this.tokens.push(new CSSToken(CSSTokenType.CloseParen, char, position));
                break;
        }
    }
    /**
     * Generates state transitions between tokens
     */
    generateStateTransitions() {
        for (let i = 0; i < this.tokens.length - 1; i++) {
            const current = this.tokens[i];
            const next = this.tokens[i + 1];
            // Determine transition symbol
            let transitionSymbol = '';
            if (next.type === CSSTokenType.StartBlock) {
                transitionSymbol = '{';
            }
            else if (next.type === CSSTokenType.EndBlock) {
                transitionSymbol = '}';
            }
            else if (next.type === CSSTokenType.Semicolon) {
                transitionSymbol = ';';
            }
            else if (next.type === CSSTokenType.Colon) {
                transitionSymbol = ':';
            }
            else {
                // Use a simplified transition symbol based on token type
                transitionSymbol = next.type;
            }
            // Add transition
            this.tokens[i] = current.addTransition(transitionSymbol, next);
        }
    }
    /**
     * Computes equivalence classes for tokens
     */
    computeEquivalenceClasses() {
        CSSToken.computeEquivalenceClasses(this.tokens);
    }
    /**
     * Helper method to check if a character is whitespace
     */
    isWhitespace(char) {
        return /[\s\n\t\r\f]/.test(char);
    }
    /**
     * Helper method to check if a character is a digit
     */
    isDigit(char) {
        return /[0-9]/.test(char);
    }
    /**
     * Helper method to check if a character is a letter
     */
    isLetter(char) {
        return /[a-zA-Z]/.test(char);
    }
    /**
     * Helper method to check if a character can start an identifier
     */
    isIdentStart(char) {
        return this.isLetter(char) || char === '_' || char === '-';
    }
    /**
     * Helper method to check if a character can be part of an identifier
     */
    isIdentChar(char) {
        return this.isIdentStart(char) || this.isDigit(char);
    }
    /**
     * Helper method to check if a character can start a number
     */
    isNumberStart(char) {
        return this.isDigit(char) || (char === '.' && this.isDigit(this.peek(1))) ||
            ((char === '+' || char === '-') &&
                (this.isDigit(this.peek(1)) ||
                    (this.peek(1) === '.' && this.isDigit(this.peek(2)))));
    }
    /**
     * Helper method to check if a character is a structural character
     */
    isStructuralChar(char) {
        return /[{}:;,()]/.test(char);
    }
    /**
     * Helper method to check if a value is a valid color
     */
    isValidColor(value) {
        return /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value);
    }
    /**
     * Helper method to peek at a character
     */
    peek(offset = 0) {
        return this.input[this.position + offset] || '';
    }
    /**
     * Helper method to advance to the next character
     */
    advance() {
        const char = this.input[this.position++];
        if (char === '\n') {
            this.line++;
            this.column = 1;
        }
        else {
            this.column++;
        }
        return char;
    }
    /**
     * Helper method to get the current position
     */
    getPosition() {
        return {
            line: this.line,
            column: this.column,
            offset: this.position
        };
    }
    /**
     * Helper method to add an error
     */
    addError(message) {
        this.errors.push({
            message,
            position: this.getPosition()
        });
        this.tokens.push(CSSToken.createError(message, this.getPosition()));
    }
}

/**
 * CSS AST Node
 * Represents a node in the CSS Abstract Syntax Tree
 */
class CSSNode {
    constructor(type, value = null) {
        this.type = type;
        this.value = value;
        this.children = [];
        this.parent = null;
        this.metadata = {
            equivalenceClass: null,
            isMinimized: false
        };
    }
    /**
     * Adds a child node
     */
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }
    /**
     * Creates a deep clone of this node
     */
    clone() {
        const cloned = new CSSNode(this.type, this.value);
        cloned.metadata = { ...this.metadata };
        for (const child of this.children) {
            const clonedChild = child.clone();
            clonedChild.parent = cloned;
            cloned.children.push(clonedChild);
        }
        return cloned;
    }
    /**
     * Gets a string representation of this node and its children
     */
    toString(indent = 0) {
        const prefix = '  '.repeat(indent);
        let result = `${prefix}${this.type}`;
        if (this.value !== null) {
            result += `: ${this.value}`;
        }
        result += '\n';
        for (const child of this.children) {
            result += child.toString(indent + 1);
        }
        return result;
    }
    /**
     * Finds all descendant nodes of a specific type
     */
    findAllByType(type) {
        const result = [];
        if (this.type === type) {
            result.push(this);
        }
        for (const child of this.children) {
            result.push(...child.findAllByType(type));
        }
        return result;
    }
}

/**
 * CSS Abstract Syntax Tree
 * Represents a complete CSS document structure
 */
class CSSAST {
    /**
     * Creates a new CSS AST
     *
     * @param root - The root node
     * @param metadata - AST metadata
     */
    constructor(root, metadata = {}) {
        this.root = root;
        this.metadata = metadata;
    }
    /**
     * Builds an AST from a list of tokens
     *
     * @param tokens - The tokens to parse
     * @returns A new CSS AST
     */
    static fromTokens(tokens) {
        const root = new CSSNode('stylesheet');
        let currentRule = null;
        let currentDeclaration = null;
        for (const token of tokens) {
            switch (token.type) {
                case CSSTokenType.Selector:
                case CSSTokenType.AtKeyword:
                    if (currentRule === null) {
                        currentRule = new CSSNode('rule');
                        root.addChild(currentRule);
                    }
                    currentRule.addChild(new CSSNode('selector', token.value.toString()));
                    break;
                case CSSTokenType.StartBlock:
                    if (currentRule === null) {
                        throw new Error('Unexpected block start');
                    }
                    break;
                case CSSTokenType.Property:
                    currentDeclaration = new CSSNode('declaration');
                    currentDeclaration.addChild(new CSSNode('property', token.value.toString()));
                    if (currentRule) {
                        currentRule.addChild(currentDeclaration);
                    }
                    break;
                case CSSTokenType.Colon:
                    if (!currentDeclaration) {
                        throw new Error('Unexpected colon');
                    }
                    break;
                case CSSTokenType.Value:
                case CSSTokenType.Number:
                case CSSTokenType.Color:
                case CSSTokenType.String:
                    if (currentDeclaration) {
                        currentDeclaration.addChild(new CSSNode('value', token.value.toString()));
                    }
                    break;
                case CSSTokenType.Unit:
                    if (currentDeclaration && currentDeclaration.children.length > 0) {
                        const lastChild = currentDeclaration.children[currentDeclaration.children.length - 1];
                        if (lastChild.type === 'value') {
                            // Append unit to the last value
                            const valueWithUnit = new CSSNode('value', lastChild.value + token.value.toString());
                            // Replace last child
                            currentDeclaration.children[currentDeclaration.children.length - 1] = valueWithUnit;
                            valueWithUnit.parent = currentDeclaration;
                        }
                    }
                    break;
                case CSSTokenType.Semicolon:
                    currentDeclaration = null;
                    break;
                case CSSTokenType.EndBlock:
                    currentRule = null;
                    currentDeclaration = null;
                    break;
            }
        }
        return new CSSAST(root);
    }
    /**
     * Creates a deep clone of the AST
     *
     * @returns A cloned AST
     */
    clone() {
        return new CSSAST(this.root.clone(), { ...this.metadata });
    }
    /**
     * Gets a string representation of the AST
     *
     * @returns A string representation
     */
    toString() {
        let result = 'CSS AST:\n';
        result += this.root.toString();
        if (this.metadata.optimizationMetrics) {
            const metrics = this.metadata.optimizationMetrics;
            result += '\nOptimization Metrics:\n';
            result += `  Original nodes: ${metrics.originalNodeCount}\n`;
            result += `  Minimized nodes: ${metrics.minimizedNodeCount}\n`;
            result += `  Optimization ratio: ${metrics.optimizationRatio}\n`;
        }
        return result;
    }
    /**
     * Computes the size of the AST
     *
     * @returns The number of nodes in the AST
     */
    getSize() {
        return this.countNodes(this.root);
    }
    /**
     * Recursively counts nodes in the AST
     *
     * @param node - The starting node
     * @returns The number of nodes
     */
    countNodes(node) {
        let count = 1; // Count the node itself
        for (const child of node.children) {
            count += this.countNodes(child);
        }
        return count;
    }
    /**
     * Finds all nodes of a specific type
     *
     * @param type - The type to search for
     * @returns An array of matching nodes
     */
    findNodesByType(type) {
        return this.root.findAllByType(type);
    }
    /**
     * Finds nodes by value
     *
     * @param value - The value to search for
     * @returns An array of matching nodes
     */
    findNodesByValue(value) {
        const result = [];
        const traverse = (node) => {
            if (node.value === value) {
                result.push(node);
            }
            for (const child of node.children) {
                traverse(child);
            }
        };
        traverse(this.root);
        return result;
    }
    /**
     * Performs a depth-first traversal of the AST
     *
     * @param callback - Function to call for each node
     */
    traverse(callback) {
        const visit = (node) => {
            callback(node);
            for (const child of node.children) {
                visit(child);
            }
        };
        visit(this.root);
    }
}

/**
 * CSS AST Optimizer
 * Implements state machine minimization techniques for CSS ASTs
 */
class CSSAstOptimizer {
    /**
     * Creates a new AST optimizer
     */
    constructor() {
        this.stateClasses = new Map();
        this.nodeSignatures = new Map();
        this.minimizedNodes = new WeakMap();
    }
    /**
     * Optimizes a CSS AST using state minimization techniques
     *
     * @param ast - The AST to optimize
     * @param options - Optimization options
     * @returns The optimized AST
     */
    optimize(ast, options = {}) {
        // Default options
        const opts = {
            mergeAdjacentValues: true,
            removeEmptyNodes: true,
            removeComments: true,
            optimizeAttributes: true,
            level: 'standard',
            ...options
        };
        // Phase 1: Build state equivalence classes
        this.buildStateClasses(ast.root);
        // Phase 2: Node reduction and path optimization
        const optimizedRoot = this.optimizeNode(ast.root, opts);
        // Phase 3: Memory optimization
        this.applyMemoryOptimizations(optimizedRoot);
        // Compute optimization metrics
        const metrics = this.computeOptimizationMetrics(ast.root, optimizedRoot);
        // Create optimized AST
        return new CSSAST(optimizedRoot, {
            ...ast.metadata,
            optimizationMetrics: {
                originalNodeCount: metrics.nodeReduction.original,
                minimizedNodeCount: metrics.nodeReduction.optimized,
                optimizationRatio: metrics.nodeReduction.ratio
            }
        });
    }
    /**
     * Builds state equivalence classes
     *
     * @param root - The root node
     */
    /**
     * Builds state equivalence classes for nodes in the AST
     * This is the first phase of the optimization process
     *
     * @param root - The root node of the AST
     */
    buildStateClasses(root) {
        const stateSignatures = new Map();
        // First pass: Collect state signatures
        const collectSignatures = (node) => {
            const signature = this.computeNodeSignature(node);
            if (!stateSignatures.has(signature)) {
                stateSignatures.set(signature, new Set());
            }
            stateSignatures.get(signature).add(node);
            for (const child of node.children) {
                collectSignatures(child);
            }
        };
        collectSignatures(root);
        // Second pass: Build equivalence classes
        let classId = 0;
        for (const [signature, nodes] of stateSignatures) {
            if (nodes.size > 1) {
                this.stateClasses.set(classId, {
                    signature,
                    nodes: new Set(nodes)
                });
                // Store signature to class ID mapping
                this.nodeSignatures.set(signature, classId);
                // Update nodes with their equivalence class
                for (const node of nodes) {
                    node.metadata.equivalenceClass = classId;
                }
                classId++;
            }
        }
    }
    /**
     * Computes a signature for a node based on its type, value, and children
     * This signature is used to identify equivalent nodes
     *
     * @param node - The node to compute a signature for
     * @returns The node signature
     */
    computeNodeSignature(node) {
        const components = [];
        // Add type and value
        components.push(node.type);
        if (node.value !== null)
            components.push(node.value);
        // Add children types signature
        if (node.children.length > 0) {
            const childrenTypes = node.children.map(c => c.type).join(',');
            components.push(childrenTypes);
        }
        return components.join('|');
    }
    /**
     * Optimizes a node and its children
     * This is the second phase of the optimization process
     *
     * @param node - The node to optimize
     * @param options - Optimization options
     * @returns The optimized node
     */
    optimizeNode(node, options) {
        // Check if node has already been minimized
        if (this.minimizedNodes.has(node)) {
            return this.minimizedNodes.get(node);
        }
        // Create optimized node
        const optimized = new CSSNode(node.type, node.value);
        optimized.metadata = { ...node.metadata, isMinimized: true };
        // Optimize children if needed
        if (node.children.length > 0) {
            optimized.children = this.optimizeChildren(node.children, options);
            optimized.children.forEach(child => child.parent = optimized);
        }
        // Cache optimized node
        this.minimizedNodes.set(node, optimized);
        return optimized;
    }
    /**
     * Optimizes an array of child nodes
     * Applies various optimizations based on the options
     *
     * @param children - The children to optimize
     * @param options - Optimization options
     * @returns The optimized children
     */
    optimizeChildren(children, options) {
        // Apply filters based on options
        let optimizedChildren = children;
        // Remove empty nodes if requested
        if (options.removeEmptyNodes) {
            optimizedChildren = optimizedChildren.filter(child => {
                if (child.type === 'value') {
                    return child.value !== null && child.value.trim().length > 0;
                }
                return true;
            });
        }
        // Remove comments if requested
        if (options.removeComments) {
            optimizedChildren = optimizedChildren.filter(child => child.type !== 'comment');
        }
        // Merge adjacent values if requested
        if (options.mergeAdjacentValues) {
            optimizedChildren = this.mergeAdjacentValues(optimizedChildren);
        }
        // Recursively optimize children
        optimizedChildren = optimizedChildren.map(child => this.optimizeNode(child, options));
        return optimizedChildren;
    }
    /**
     * Merges adjacent value nodes
     * This helps reduce the number of nodes in the AST
     *
     * @param children - The children to merge
     * @returns The merged children
     */
    mergeAdjacentValues(children) {
        const merged = [];
        let currentValue = null;
        for (const child of children) {
            if (child.type === 'value') {
                if (currentValue) {
                    // Merge with previous value
                    currentValue.value += ' ' + child.value;
                }
                else {
                    // Start a new value
                    currentValue = child;
                    merged.push(currentValue);
                }
            }
            else {
                // Reset current value
                currentValue = null;
                merged.push(child);
            }
        }
        return merged;
    }
    /**
     * Applies memory optimizations to a node tree
     * This is the third phase of the optimization process
     *
     * @param node - The node to optimize
     */
    applyMemoryOptimizations(node) {
        // Freeze metadata to prevent modifications
        Object.freeze(node.metadata);
        // Recursively optimize children
        for (const child of node.children) {
            this.applyMemoryOptimizations(child);
        }
        // Freeze children array
        Object.freeze(node.children);
        // Freeze the node itself to prevent modifications
        Object.freeze(node);
    }
    /**
     * Computes optimization metrics by comparing original and optimized ASTs
     *
     * @param originalRoot - The original root node
     * @param optimizedRoot - The optimized root node
     * @returns Optimization metrics
     */
    computeOptimizationMetrics(originalRoot, optimizedRoot) {
        const originalMetrics = this.getNodeMetrics(originalRoot);
        const optimizedMetrics = this.getNodeMetrics(optimizedRoot);
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
                averageSize: this.stateClasses.size > 0
                    ? Array.from(this.stateClasses.values())
                        .reduce((acc, cls) => acc + cls.nodes.size, 0) / this.stateClasses.size
                    : 0
            }
        };
    }
    /**
     * Collects metrics about a node and its children
     *
     * @param node - The node to analyze
     * @param metrics - The metrics object to update
     * @returns The updated metrics
     */
    getNodeMetrics(node, metrics = { totalNodes: 0, estimatedMemory: 0 }) {
        // Count the node
        metrics.totalNodes++;
        // Estimate memory usage
        metrics.estimatedMemory += this.estimateNodeMemory(node);
        // Recursively process children
        for (const child of node.children) {
            this.getNodeMetrics(child, metrics);
        }
        return metrics;
    }
    /**
     * Estimates the memory usage of a node in bytes
     *
     * @param node - The node to analyze
     * @returns Estimated memory usage in bytes
     */
    estimateNodeMemory(node) {
        var _a, _b, _c, _d;
        let bytes = 0;
        // Base object overhead
        bytes += 40;
        // Type string
        bytes += ((_b = (_a = node.type) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) * 2;
        // Value string
        bytes += ((_d = (_c = node.value) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) * 2;
        // Metadata
        bytes += JSON.stringify(node.metadata).length * 2;
        return bytes;
    }
}

/**
 * CSS Parser Error
 * Represents an error that occurred during parsing
 */
class CSSParserError extends Error {
    /**
     * Creates a new parser error
     *
     * @param message - The error message
     * @param position - The position where the error occurred
     * @param token - The token that caused the error
     */
    constructor(message, position, token = null) {
        super(`${message} at line ${position.line}, column ${position.column}`);
        this.name = 'CSSParserError';
        this.position = position;
        this.token = token;
    }
    /**
     * Creates a string representation of the error
     *
     * @returns A string representation
     */
    toString() {
        return `${this.name}: ${this.message}`;
    }
}

/**
 * CSS Parser
 * Parses tokens into an AST
 */
class CSSParser {
    /**
     * Creates a new CSS parser
     *
     * @param tokens - The tokens to parse
     * @param options - Parser options
     */
    constructor(tokens, options = {}) {
        this.tokens = tokens;
        this.position = 0;
        this.errors = [];
        this.options = {
            errorRecovery: true,
            preserveComments: false,
            strict: false,
            ...options
        };
    }
    /**
     * Parses tokens into an AST
     *
     * @returns The parsed AST
     */
    parse() {
        const ast = this.parseStylesheet();
        // Validate parsing completed
        if (this.position < this.tokens.length - 1) { // -1 for EOF
            this.addError('Unexpected tokens at end of input');
        }
        return ast;
    }
    /**
     * Parses the entire stylesheet
     *
     * @returns The parsed AST
     */
    parseStylesheet() {
        const root = new CSSNode('stylesheet');
        // Main parsing loop
        while (this.position < this.tokens.length) {
            const token = this.peek();
            // Handle EOF
            if (!token || token.type === CSSTokenType.EOF) {
                break;
            }
            // Skip comments if not preserving them
            if (token.type === CSSTokenType.Comment) {
                if (this.options.preserveComments) {
                    const commentNode = new CSSNode('comment', token.value.toString());
                    root.addChild(commentNode);
                }
                this.consume();
                continue;
            }
            // Skip whitespace
            if (token.type === CSSTokenType.Whitespace) {
                this.consume();
                continue;
            }
            // Parse at-rules or regular rules
            if (token.type === CSSTokenType.AtKeyword) {
                try {
                    const atRule = this.parseAtRule();
                    if (atRule)
                        root.addChild(atRule);
                }
                catch (error) {
                    if (error instanceof CSSParserError) {
                        this.errors.push(error);
                        if (!this.options.errorRecovery)
                            throw error;
                        this.recoverFromError();
                    }
                    else {
                        throw error; // Re-throw unknown errors
                    }
                }
            }
            else {
                try {
                    const rule = this.parseRule();
                    if (rule)
                        root.addChild(rule);
                }
                catch (error) {
                    if (error instanceof CSSParserError) {
                        this.errors.push(error);
                        if (!this.options.errorRecovery)
                            throw error;
                        this.recoverFromError();
                    }
                    else {
                        throw error; // Re-throw unknown errors
                    }
                }
            }
        }
        return new CSSAST(root);
    }
    /**
     * Parses an at-rule
     *
     * @returns The parsed at-rule node
     */
    parseAtRule() {
        var _a, _b;
        const token = this.consume(); // @-keyword
        const atRule = new CSSNode('at-rule', token.value.toString());
        // Parse prelude
        const prelude = new CSSNode('prelude');
        while (this.position < this.tokens.length) {
            const token = this.peek();
            if (!token ||
                token.type === CSSTokenType.EOF ||
                token.type === CSSTokenType.StartBlock ||
                token.type === CSSTokenType.Semicolon) {
                break;
            }
            if (token.type === CSSTokenType.Whitespace || token.type === CSSTokenType.Comment) {
                this.consume();
                continue;
            }
            // Add text node for prelude content
            prelude.addChild(new CSSNode('text', token.value.toString()));
            this.consume();
        }
        if (prelude.children.length > 0) {
            atRule.addChild(prelude);
        }
        // Parse block if present
        if (((_a = this.peek()) === null || _a === void 0 ? void 0 : _a.type) === CSSTokenType.StartBlock) {
            this.consume(); // {
            const block = this.parseBlock();
            atRule.addChild(block);
        }
        else if (((_b = this.peek()) === null || _b === void 0 ? void 0 : _b.type) === CSSTokenType.Semicolon) {
            this.consume(); // ;
        }
        else {
            this.addError('Expected { or ; after at-rule');
        }
        return atRule;
    }
    /**
     * Parses a CSS rule
     *
     * @returns The parsed rule node
     */
    parseRule() {
        var _a;
        const rule = new CSSNode('rule');
        const selectors = [];
        let hasBlock = false;
        // Parse selectors
        while (this.position < this.tokens.length) {
            const token = this.peek();
            if (!token || token.type === CSSTokenType.EOF) {
                break;
            }
            if (token.type === CSSTokenType.StartBlock) {
                hasBlock = true;
                this.consume();
                break;
            }
            if (token.type === CSSTokenType.Whitespace || token.type === CSSTokenType.Comment) {
                this.consume();
                continue;
            }
            if (token.type === CSSTokenType.Comma) {
                this.consume();
                continue;
            }
            if (token.type === CSSTokenType.Selector || token.type === CSSTokenType.Property) {
                selectors.push(new CSSNode('selector', token.value.toString()));
                this.consume();
            }
            else {
                // Skip unknown tokens
                this.consume();
            }
        }
        // Add selectors to rule
        for (const selector of selectors) {
            rule.addChild(selector);
        }
        // Parse declarations if we found a block
        if (hasBlock) {
            const declarations = this.parseDeclarations();
            // Add declarations to rule
            for (const declaration of declarations) {
                rule.addChild(declaration);
            }
            // Consume closing brace
            if (((_a = this.peek()) === null || _a === void 0 ? void 0 : _a.type) === CSSTokenType.EndBlock) {
                this.consume();
            }
            else {
                this.addError('Expected } at end of rule');
            }
        }
        // Only return a rule if we have valid selectors
        if (selectors.length > 0) {
            return rule;
        }
        return null;
    }
    /**
     * Parses a block of declarations
     *
     * @returns An array of declaration nodes
     */
    parseBlock() {
        var _a;
        const block = new CSSNode('block');
        const declarations = this.parseDeclarations();
        // Add declarations to block
        for (const declaration of declarations) {
            block.addChild(declaration);
        }
        // Consume closing brace
        if (((_a = this.peek()) === null || _a === void 0 ? void 0 : _a.type) === CSSTokenType.EndBlock) {
            this.consume();
        }
        else {
            this.addError('Expected } at end of block');
        }
        return block;
    }
    /**
     * Parses declarations inside a block
     *
     * @returns An array of declaration nodes
     */
    parseDeclarations() {
        const declarations = [];
        while (this.position < this.tokens.length) {
            const token = this.peek();
            if (!token ||
                token.type === CSSTokenType.EOF ||
                token.type === CSSTokenType.EndBlock) {
                break;
            }
            if (token.type === CSSTokenType.Whitespace || token.type === CSSTokenType.Comment) {
                this.consume();
                continue;
            }
            try {
                const declaration = this.parseDeclaration();
                if (declaration) {
                    declarations.push(declaration);
                }
            }
            catch (error) {
                if (error instanceof CSSParserError) {
                    this.errors.push(error);
                    if (!this.options.errorRecovery)
                        throw error;
                    this.recoverFromError();
                }
                else {
                    throw error; // Re-throw unknown errors
                }
            }
        }
        return declarations;
    }
    /**
     * Parses a single declaration
     *
     * @returns A declaration node
     */
    parseDeclaration() {
        var _a, _b;
        // Get property
        const token = this.peek();
        if (!token || (token.type !== CSSTokenType.Property && token.type !== CSSTokenType.Selector)) {
            return null;
        }
        const property = new CSSNode('property', token.value.toString());
        this.consume();
        // Skip whitespace
        this.skipWhitespace();
        // Expect colon
        if (((_a = this.peek()) === null || _a === void 0 ? void 0 : _a.type) !== CSSTokenType.Colon) {
            this.addError('Expected : after property name');
            this.skipToSemicolon();
            return null;
        }
        this.consume(); // :
        // Skip whitespace
        this.skipWhitespace();
        // Parse values
        const values = [];
        while (this.position < this.tokens.length) {
            const token = this.peek();
            if (!token ||
                token.type === CSSTokenType.EOF ||
                token.type === CSSTokenType.Semicolon ||
                token.type === CSSTokenType.EndBlock) {
                break;
            }
            if (token.type === CSSTokenType.Whitespace || token.type === CSSTokenType.Comment) {
                this.consume();
                continue;
            }
            // Add value
            values.push(new CSSNode('value', token.value.toString()));
            this.consume();
        }
        // Create declaration node
        const declaration = new CSSNode('declaration');
        declaration.addChild(property);
        // Add values to declaration
        for (const value of values) {
            declaration.addChild(value);
        }
        // Optional semicolon
        if (((_b = this.peek()) === null || _b === void 0 ? void 0 : _b.type) === CSSTokenType.Semicolon) {
            this.consume();
        }
        return declaration;
    }
    /**
     * Skips whitespace tokens
     */
    skipWhitespace() {
        var _a;
        while (this.position < this.tokens.length &&
            ((_a = this.peek()) === null || _a === void 0 ? void 0 : _a.type) === CSSTokenType.Whitespace) {
            this.consume();
        }
    }
    /**
     * Skips to the next semicolon (error recovery)
     */
    skipToSemicolon() {
        var _a;
        while (this.position < this.tokens.length) {
            const token = this.peek();
            if (!token ||
                token.type === CSSTokenType.Semicolon ||
                token.type === CSSTokenType.EndBlock) {
                break;
            }
            this.consume();
        }
        if (((_a = this.peek()) === null || _a === void 0 ? void 0 : _a.type) === CSSTokenType.Semicolon) {
            this.consume();
        }
    }
    /**
     * Recovers from an error by skipping to the next rule
     */
    recoverFromError() {
        while (this.position < this.tokens.length) {
            const token = this.peek();
            if (!token || token.type === CSSTokenType.EOF) {
                break;
            }
            // Skip to the end of the current block
            if (token.type === CSSTokenType.EndBlock) {
                this.consume();
                break;
            }
            // Skip to the next semicolon
            if (token.type === CSSTokenType.Semicolon) {
                this.consume();
                break;
            }
            // Found potential start of new rule
            if (token.type === CSSTokenType.Selector || token.type === CSSTokenType.AtKeyword) {
                break;
            }
            this.consume();
        }
    }
    /**
     * Peeks at the current token
     *
     * @returns The current token or null
     */
    peek() {
        return this.tokens[this.position] || null;
    }
    /**
     * Consumes the current token
     *
     * @returns The consumed token
     */
    consume() {
        return this.tokens[this.position++];
    }
    /**
     * Adds a parser error
     *
     * @param message - The error message
     */
    addError(message) {
        const token = this.peek();
        this.errors.push(new CSSParserError(message, token ? token.position : { line: 0, column: 0 }, token));
    }
}

exports.CSSAST = CSSAST;
exports.CSSAstOptimizer = CSSAstOptimizer;
exports.CSSNode = CSSNode;
exports.CSSParser = CSSParser;
exports.CSSParserError = CSSParserError;
exports.CSSToken = CSSToken;
exports.CSSTokenType = CSSTokenType;
exports.CSSTokenizer = CSSTokenizer;
//# sourceMappingURL=dom-asm-css.js.map
