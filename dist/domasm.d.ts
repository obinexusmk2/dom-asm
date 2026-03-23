/**
 * Core types for the DOM ASM library.
 * These types define the fundamental data structures used throughout the library.
 */
/**
 * Represents a state in a state machine
 */
interface State {
    id: string;
    transitions: Map<string, string>;
    metadata: Map<string, any>;
    isAccepting: boolean;
}
/**
 * Represents a state machine
 */
interface StateMachine {
    states: Map<string, State>;
    initialState: string;
    currentState: string;
}
/**
 * Represents a node in an Abstract Syntax Tree
 */
interface Node$1 {
    type: string;
    name?: string;
    value?: string;
    attributes?: Map<string, string>;
    children?: Node$1[];
    metadata?: {
        [key: string]: any;
    };
}
/**
 * Represents an Abstract Syntax Tree
 */
interface AST {
    root: Node$1;
    metadata: {
        [key: string]: any;
    };
}
/**
 * Base interface for any element in the DOM ASM system
 */
interface DOMElement {
    id: string;
    type: string;
    children: DOMElement[];
    parent?: DOMElement;
    attributes?: Map<string, string>;
    events?: Map<string, Function[]>;
}
/**
 * Interface for a DOM node
 */
interface DOMNode extends DOMElement {
    nodeName: string;
    nodeValue?: string;
    nodeType: number;
}
/**
 * Interface for a DOM text node
 */
interface DOMTextNode extends DOMNode {
    textContent: string;
}
/**
 * Interface for a DOM element node
 */
interface DOMElementNode extends DOMNode {
    tagName: string;
    innerHTML: string;
    outerHTML: string;
    classList: string[];
    style: Map<string, string>;
}
/**
 * Interface for DOM walker used to traverse the DOM
 */
interface DOMWalker {
    nextNode(): DOMNode | null;
    previousNode(): DOMNode | null;
    parentNode(): DOMNode | null;
    firstChild(): DOMNode | null;
    lastChild(): DOMNode | null;
    nextSibling(): DOMNode | null;
    previousSibling(): DOMNode | null;
}
/**
 * Interface for token position information
 */
interface Position$1 {
    line: number;
    column: number;
    offset: number;
}
/**
 * Interface for a token in a stream
 */
interface Token {
    type: string;
    value: string;
    position: Position$1;
}
/**
 * Interface for token stream
 */
interface TokenStream {
    tokens: Token[];
    position: number;
    peek(): Token | null;
    next(): Token | null;
    back(): void;
    hasNext(): boolean;
    reset(): void;
}
/**
 * Interface for a compilation unit (such as an HTML file)
 */
interface CompilationUnit {
    id: string;
    source: string;
    ast: AST;
    tokens: TokenStream;
    dependencies: CompilationUnit[];
}
/**
 * Interface for a visitor in the visitor pattern
 */
interface Visitor {
    visit(node: Node$1): void;
    visitChildren(node: Node$1): void;
}
/**
 * Interface for a traverser using the visitor pattern
 */
interface Traverser {
    traverse(ast: AST, visitor: Visitor): void;
}
/**
 * Interface for a parser rule
 */
interface Rule {
    name: string;
    pattern: RegExp | string | Function;
    action: (match: any, context: any) => any;
}
/**
 * Interface for a parser
 */
interface Parser {
    rules: Rule[];
    parse(input: string): AST;
    parseTokens(tokens: TokenStream): AST;
}
/**
 * Interface for a tokenizer
 */
interface Tokenizer {
    rules: Rule[];
    tokenize(input: string): TokenStream;
}
/**
 * Interface for a code generator
 */
interface CodeGenerator {
    generate(ast: AST): string;
}
/**
 * Interface for optimization metrics
 */
interface OptimizationMetrics {
    before: {
        nodes: number;
        depth: number;
        size: number;
    };
    after: {
        nodes: number;
        depth: number;
        size: number;
    };
    ratio: number;
    time: number;
}
/**
 * Interface for optimization options
 */
interface OptimizationOptions$1 {
    mergeTextNodes?: boolean;
    removeWhitespace?: boolean;
    removeComments?: boolean;
    minimizeDataStructures?: boolean;
    optimizeAttributes?: boolean;
    level?: 'minimal' | 'standard' | 'aggressive';
}
/**
 * Interface for an optimizer
 */
interface Optimizer {
    optimize(ast: AST, options?: OptimizationOptions$1): AST;
    getMetrics(): OptimizationMetrics;
}
/**
 * Interface for a renderer
 */
interface Renderer {
    render(ast: AST): any;
}
/**
 * Interface for a diff operation
 */
interface DiffOperation {
    type: 'insert' | 'delete' | 'update' | 'move';
    path: string[];
    oldValue?: any;
    newValue?: any;
    from?: string[];
    to?: string[];
}
/**
 * Interface for a diff result
 */
interface DiffResult {
    operations: DiffOperation[];
    similarity: number;
}
/**
 * Interface for a differ
 */
interface Differ {
    diff(oldAst: AST, newAst: AST): DiffResult;
}
/**
 * Interface for a patch operation
 */
interface PatchOperation {
    type: 'insert' | 'delete' | 'update' | 'move';
    path: string[];
    value?: any;
    from?: string[];
    to?: string[];
}
/**
 * Interface for a patch result
 */
interface PatchResult {
    success: boolean;
    ast: AST;
    errors: string[];
}
/**
 * Interface for a patcher
 */
interface Patcher {
    patch(ast: AST, operations: PatchOperation[]): PatchResult;
}
/**
 * Interface for a logger
 */
interface Logger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}
/**
 * Interface for configuration options
 */
interface ConfigOptions {
    optimization?: OptimizationOptions$1;
    parsing?: {
        strictMode?: boolean;
        errorRecovery?: boolean;
        [key: string]: any;
    };
    rendering?: {
        [key: string]: any;
    };
    [key: string]: any;
}
/**
 * Interface for the main DOM ASM class
 */
interface DOMASM {
    parse(input: string): AST;
    optimize(ast: AST, options?: OptimizationOptions$1): AST;
    diff(oldAst: AST, newAst: AST): DiffResult;
    patch(ast: AST, operations: PatchOperation[]): PatchResult;
    render(ast: AST): any;
    compile(input: string): any;
}

/**
 * DomASM Main API
 *
 * Provides a unified interface to the DOM ASM functionality,
 * including parsing, optimization, diffing, patching, and rendering.
 */
declare class DomASM {
    private parser;
    private optimizer;
    private diffPatcher;
    constructor();
    parse(input: string): AST;
    optimize(ast: AST, _options?: OptimizationOptions$1): AST;
    diff(oldAst: AST, newAst: AST): any[];
    patch(ast: AST, patches: any[]): Node$1;
    render(ast: AST): any;
    private convertToVNode;
    process(input: string): any;
    updateDOM(domNode: any, newHTML: string): any;
    private diffVNodes;
    private convertToASTNode;
    private generateVNodePatches;
    private applyVNodePatches;
}
declare function parse(html: string): AST;
declare function render(ast: AST): any;
declare function process(html: string): any;
declare function optimize(ast: AST, options?: OptimizationOptions$1): AST;
declare function diff(oldAst: AST, newAst: AST): any[];
declare function patch(ast: AST, patches: any[]): Node$1;
declare function updateDOM(domNode: any, newHTML: string): any;

/**
 * StateMachineMinimizer
 * Class that implements automaton state minimization algorithms to reduce
 * the size and complexity of state machines while preserving their behavior.
 */
declare class StateMachineMinimizer {
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

/**
 * Creates a new State with the given parameters.
 */
declare function createState(id: string, isAccepting?: boolean, metadata?: Record<string, any>): State;
/**
 * Adds a transition from one state to another on a given symbol.
 */
declare function addTransition(state: State, symbol: string, targetStateId: string): void;

/**
 * Creates a new StateMachine with an initial state.
 */
declare function createStateMachine(initialStateId?: string): StateMachine;
/**
 * Adds a state to the state machine.
 */
declare function addState(machine: StateMachine, state: State): void;
/**
 * Transitions the state machine to the next state based on the input symbol.
 * Returns true if the transition was successful, false otherwise.
 */
declare function transition(machine: StateMachine, symbol: string): boolean;
/**
 * Resets the state machine to its initial state.
 */
declare function reset(machine: StateMachine): void;
/**
 * Checks if the state machine is currently in an accepting state.
 */
declare function isAccepting(machine: StateMachine): boolean;

/**
 * Represents a difference between two ASTs
 */
interface Diff {
    type: 'ADD' | 'REMOVE' | 'UPDATE' | 'REPLACE' | 'MOVE';
    path: number[];
    node?: Node$1;
    changes?: Record<string, any>;
    from?: number[];
    to?: number[];
}
/**
 * Represents a patch operation to be applied to the DOM
 */
interface Patch {
    type: 'CREATE' | 'UPDATE' | 'REPLACE' | 'REMOVE' | 'MOVE';
    path: number[];
    node?: Node$1;
    attributes?: Record<string, any>;
    from?: number[];
    to?: number[];
}
/**
 * Options for the diffing algorithm
 */
interface DiffOptions {
    ignoreWhitespace?: boolean;
    ignoreCase?: boolean;
    optimizeTextChanges?: boolean;
    useKeyAttribute?: string;
}
/**
 * DiffPatchEngine
 * Computes differences between two ASTs and generates patches that can be
 * applied to the DOM to transform it from one state to another.
 */
declare class DiffPatchEngine {
    private options;
    private keyMap;
    constructor(options?: DiffOptions);
    /**
     * Computes differences between two ASTs.
     *
     * @param oldAST - The original AST
     * @param newAST - The new AST
     * @returns An array of differences
     */
    diff(oldAST: AST, newAST: AST): Diff[];
    /**
     * Preprocesses an AST to identify and map nodes with key attributes.
     *
     * @param node - The node to preprocess
     * @param path - The current path to the node
     */
    private preprocessKeysInAST;
    /**
     * Recursively computes differences between two nodes.
     *
     * @param oldNode - The original node
     * @param newNode - The new node
     * @param path - The current path to the node
     * @param diffs - The array of differences to update
     */
    private diffNodes;
    /**
     * Computes differences between the attributes of two nodes.
     *
     * @param oldNode - The original node
     * @param newNode - The new node
     * @returns Object containing attribute changes
     */
    private diffAttributes;
    /**
     * Computes differences between the children of two nodes.
     * Uses key attributes for improved matching when available.
     *
     * @param oldNode - The original node
     * @param newNode - The new node
     * @param path - The current path to the node
     * @param diffs - The array of differences to update
     */
    private diffChildren;
    /**
     * Diffs children using key attributes to match nodes.
     * This allows for more accurate tracking of node movement.
     *
     * @param oldChildren - The original children
     * @param newChildren - The new children
     * @param path - The current path to the parent node
     * @param diffs - The array of differences to update
     */
    private diffChildrenWithKeys;
    /**
     * Diffs children without using key attributes.
     * Uses position-based comparison with heuristics for better matching.
     *
     * @param oldChildren - The original children
     * @param newChildren - The new children
     * @param path - The current path to the parent node
     * @param diffs - The array of differences to update
     */
    private diffChildrenWithoutKeys;
    /**
     * Builds a Longest Common Subsequence matrix for two sets of nodes.
     *
     * @param oldNodes - The original nodes
     * @param newNodes - The new nodes
     * @returns A 2D matrix for LCS calculation
     */
    private buildLCSMatrix;
    /**
     * Extracts matched pairs of indices from an LCS matrix.
     *
     * @param matrix - The LCS matrix
     * @param oldNodes - The original nodes
     * @param newNodes - The new nodes
     * @returns An array of [oldIndex, newIndex] pairs
     */
    private extractMatchedPairs;
    /**
     * Determines if two nodes are considered equal for matching purposes.
     *
     * @param oldNode - The original node
     * @param newNode - The new node
     * @returns Whether the nodes are considered equal
     */
    private areNodesEqual;
    /**
     * Optimizes an array of diffs to reduce redundancy and improve efficiency.
     *
     * @param diffs - The array of diffs to optimize
     * @returns An optimized array of diffs
     */
    private optimizeDiffs;
    /**
     * Marks all child paths of a given path as processed.
     *
     * @param path - The parent path
     * @param processedPaths - The set of processed paths to update
     */
    private markChildPathsAsProcessed;
    /**
     * Sorts diffs by operation order to ensure correct application.
     *
     * @param diffs - The diffs to sort
     * @returns Sorted diffs
     */
    private sortDiffsByOperationOrder;
    /**
     * Creates a deep clone of a node.
     *
     * @param node - The node to clone
     * @returns A cloned copy of the node
     */
    private cloneNode;
    /**
     * Generates DOM patches from computed differences.
     *
     * @param diffs - The array of differences
     * @returns An array of patches that can be applied to the DOM
     */
    generatePatches(diffs: Diff[]): Patch[];
    /**
     * Applies patches to a DOM node to transform it.
     *
     * @param domNode - The DOM node to patch
     * @param patches - The patches to apply
     * @returns The patched DOM node
     */
    patch(domNode: Node$1, patches: Patch[]): Node$1;
    /**
     * Applies a single patch to a DOM node.
     *
     * @param node - The DOM node to patch
     * @param patch - The patch to apply
     * @returns The patched DOM node
     */
    private applyPatch;
    /**
     * Finds a node by its path in the tree.
     *
     * @param root - The root node
     * @param path - The path to the target node
     * @returns The target node or undefined if not found
     */
    private findNodeByPath;
    /**
     * Creates a new node as a child of the target node.
     *
     * @param parent - The parent node
     * @param newNode - The node to create
     */
    private createNode;
    /**
     * Updates a node's attributes.
     *
     * @param node - The node to update
     * @param attributes - The attributes to update
     */
    private updateNodeAttributes;
    /**
     * Replaces a node with a new node.
     *
     * @param oldNode - The node to replace
     * @param newNode - The replacement node
     */
    private replaceNode;
    /**
     * Removes a node from its parent.
     *
     * @param node - The node to remove
     */
    private removeNode;
    /**
     * Moves a node from one position to another.
     *
     * @param root - The root node
     * @param fromPath - The source path
     * @param toPath - The destination path
     */
    private moveNode;
    /**
     * Finds the parent node of a given node.
     *
     * @param node - The node to find the parent of
     * @returns The parent node or undefined if not found
     */
    private findParentNode;
}

/**
 * Enum-like object defining HTML token types
 */
declare const HTMLTokenType: {
    readonly StartTag: "StartTag";
    readonly EndTag: "EndTag";
    readonly Text: "Text";
    readonly Comment: "Comment";
    readonly ConditionalComment: "ConditionalComment";
    readonly Doctype: "Doctype";
    readonly CDATA: "CDATA";
    readonly EOF: "EOF";
};
declare type TokenType$1 = typeof HTMLTokenType[keyof typeof HTMLTokenType];
/**
 * Base token interface with common properties
 */
interface BaseToken {
    type: TokenType$1;
    start: number;
    end: number;
    line: number;
    column: number;
}
/**
 * StartTag token with attributes
 */
interface StartTagToken extends BaseToken {
    type: 'StartTag';
    name: string;
    attributes: Map<string, string>;
    selfClosing: boolean;
    namespace?: string;
}
/**
 * EndTag token
 */
interface EndTagToken extends BaseToken {
    type: 'EndTag';
    name: string;
    namespace?: string;
}
/**
 * Text content token
 */
interface TextToken extends BaseToken {
    type: 'Text';
    content: string;
    isWhitespace: boolean;
}
/**
 * Comment token
 */
interface CommentToken extends BaseToken {
    type: 'Comment';
    data: string;
    isConditional?: boolean;
}
/**
 * Conditional comment token (IE-specific)
 */
interface ConditionalCommentToken extends BaseToken {
    type: 'ConditionalComment';
    condition: string;
    content: string;
}
/**
 * DOCTYPE declaration token
 */
interface DoctypeToken extends BaseToken {
    type: 'Doctype';
    name: string;
    publicId?: string;
    systemId?: string;
}
/**
 * CDATA section token
 */
interface CDATAToken extends BaseToken {
    type: 'CDATA';
    content: string;
}
/**
 * End-of-file token
 */
interface EOFToken extends BaseToken {
    type: 'EOF';
}
/**
 * Union type of all possible token types
 */
declare type HTMLToken = StartTagToken | EndTagToken | TextToken | CommentToken | ConditionalCommentToken | DoctypeToken | CDATAToken | EOFToken;
/**
 * Error information for tokenization errors
 */
interface TokenizerError {
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
interface TokenizerOptions$1 {
    xmlMode?: boolean;
    recognizeCDATA?: boolean;
    recognizeConditionalComments?: boolean;
    preserveWhitespace?: boolean;
    allowUnclosedTags?: boolean;
    advanced?: boolean;
}

/**
 * Interface for HTML node structure
 */
interface HTMLNode {
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
interface HTMLAst {
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
declare class HTMLParserError extends Error {
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
declare class HTMLParser {
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

/**
 * HTMLAstOptimizer
 * Optimizes AST (Abstract Syntax Tree) representations of HTML by identifying
 * and merging equivalent nodes, reducing redundancy while preserving semantics.
 */
declare class HTMLAstOptimizer {
    private stateClasses;
    private nodeSignatures;
    private minimizedNodes;
    constructor();
    /**
     * Optimize an AST to reduce redundancy while preserving semantics.
     *
     * @param ast - The AST to optimize
     * @returns An optimized AST with equivalent functionality
     */
    optimize(ast: AST): AST;
    /**
     * Builds equivalence classes for nodes in the AST based on their structure and semantics.
     *
     * @param ast - The AST to analyze
     */
    private buildStateClasses;
    /**
     * Computes a unique signature for a node based on its structure and content.
     *
     * @param node - The node to compute a signature for
     * @returns A string signature that uniquely identifies the node's structure
     */
    private computeNodeSignature;
    /**
     * Optimizes a node by reducing redundancy and applying optimizations.
     *
     * @param node - The node to optimize
     * @returns An optimized version of the node
     */
    private optimizeNode;
    /**
     * Optimizes a list of child nodes by removing redundancies and merging when possible.
     *
     * @param children - The child nodes to optimize
     * @returns An optimized list of child nodes
     */
    private optimizeChildren;
    /**
     * Merges adjacent text nodes to reduce node count.
     *
     * @param children - The child nodes to process
     * @returns Nodes with adjacent text nodes merged
     */
    private mergeAdjacentTextNodes;
    /**
     * Applies memory optimizations to the optimized node structure.
     *
     * @param node - The node to optimize for memory usage
     */
    private applyMemoryOptimizations;
    /**
     * Computes optimization metrics by comparing original and optimized trees.
     *
     * @param originalRoot - The root node of the original AST
     * @param optimizedRoot - The root node of the optimized AST
     * @returns Metrics showing the effectiveness of the optimization
     */
    private computeOptimizationMetrics;
    /**
     * Gets node metrics including total count and estimated memory usage.
     *
     * @param node - The node to analyze
     * @param metrics - Optional existing metrics to update
     * @returns Updated metrics for the node and its children
     */
    private getNodeMetrics;
    /**
     * Estimates memory usage for a node.
     *
     * @param node - The node to estimate memory usage for
     * @returns Estimated bytes used by the node
     */
    private estimateNodeMemory;
}

/**
 * Core HTML node property types
 */
interface HTMLVNodeProps {
    [key: string]: any;
    className?: string;
    style?: {
        [key: string]: string | number;
    };
    value?: string;
    name?: string;
    textContent?: string;
    attributes?: {
        [key: string]: string;
    };
}
/**
 * State management for virtual nodes
 */
interface HTMLVNodeState {
    id: number;
    transitions: Map<string, HTMLVNodeState>;
    isMinimized: boolean;
    equivalenceClass: number | null;
}
/**
 * Base class for virtual DOM nodes
 */
declare abstract class VNodeBase {
    /**
     * Creates a clone of this node
     */
    abstract clone(): VNodeBase;
    /**
     * Checks if another node is equal to this one
     *
     * @param other - The node to compare with
     */
    abstract equals(other: VNodeBase): boolean;
}
/**
 * A virtual DOM node for HTML elements
 */
declare class HTMLVNode extends VNodeBase {
    private static nodeCounter;
    readonly type: string;
    readonly props: HTMLVNodeProps;
    readonly children: HTMLVNode[];
    readonly key?: string | number;
    state: HTMLVNodeState;
    /**
     * Creates a new HTML virtual node
     *
     * @param type - The node type
     * @param props - Node properties
     * @param children - Child nodes
     * @param key - Optional key for efficient diffing
     */
    constructor(type: string, props?: HTMLVNodeProps, children?: HTMLVNode[], key?: string | number);
    /**
     * Creates a text node
     *
     * @param content - The text content
     */
    static createText(content: string): HTMLVNode;
    /**
     * Creates an element node
     *
     * @param type - The element type
     * @param props - Element properties
     * @param children - Child elements or strings
     */
    static createElement(type: string, props?: HTMLVNodeProps, ...children: (HTMLVNode | string | HTMLVNode[])[]): HTMLVNode;
    /**
     * Clones this node with optional new props and children
     *
     * @param props - New props to apply
     * @param children - New children
     */
    clone(props?: Partial<HTMLVNodeProps>, children?: HTMLVNode[]): HTMLVNode;
    /**
     * Checks if another node equals this one
     *
     * @param other - The node to compare with
     */
    equals(other: VNodeBase): boolean;
    /**
     * Compares props with another node's props
     *
     * @param otherProps - The props to compare with
     */
    private compareProps;
    /**
     * Compares children with another node's children
     *
     * @param otherChildren - The children to compare with
     */
    private compareChildren;
    /**
     * Generates a state signature for this node
     */
    getStateSignature(): string;
    /**
     * Sets a DOM attribute
     *
     * @param element - The element to set the attribute on
     * @param key - The attribute key
     * @param value - The attribute value
     */
    private setDOMAttribute;
    /**
     * Converts this virtual node to a DOM node
     */
    toDOM(): Node;
    /**
     * Minimizes this node's state by computing equivalence
     */
    minimizeState(): void;
    /**
     * Gets the static node map for signature tracking
     * This map is used to track equivalence classes across all nodes
     */
    private static _signatureMap;
    private static getStaticNodeMap;
    /**
     * Creates an HTMLVNode from an HTML string
     *
     * @param html - The HTML string to parse
     */
    static fromHTML(html: string): HTMLVNode;
    /**
     * Creates an HTMLVNode from a DOM element
     *
     * @param element - The DOM element to convert
     */
    static fromDOM(element: Node): HTMLVNode;
    /**
     * Flattens nested arrays of nodes into a single array
     *
     * @param children - The children to flatten
     */
    static flatten(children: (HTMLVNode | string | HTMLVNode[] | null | undefined)[]): HTMLVNode[];
    /**
     * Performs a depth-first traversal of the virtual DOM tree
     *
     * @param callback - The callback to run for each node
     */
    traverse(callback: (node: HTMLVNode) => void): void;
    /**
     * Updates this node's props and returns a new node
     *
     * @param props - The new props to apply
     */
    updateProps(props: Partial<HTMLVNodeProps>): HTMLVNode;
    /**
     * Updates this node's children and returns a new node
     *
     * @param newChildren - The new children to use
     */
    updateChildren(newChildren: HTMLVNode[]): HTMLVNode;
    /**
     * Creates an optimized HTML string from this virtual DOM tree
     */
    toHTML(): string;
    /**
     * Checks if this node matches a selector
     * This is a simplified implementation that only supports tag and class selectors
     *
     * @param selector - The selector to match against
     */
    matches(selector: string): boolean;
    /**
     * Finds the first node that matches a selector
     *
     * @param selector - The selector to match against
     */
    querySelector(selector: string): HTMLVNode | null;
    /**
     * Finds all nodes that match a selector
     *
     * @param selector - The selector to match against
     */
    querySelectorAll(selector: string): HTMLVNode[];
}

/**
 * Result of the tokenization process
 */
interface TokenizerResult$1 {
    tokens: HTMLToken[];
    errors: TokenizerError[];
}
/**
 * HTMLTokenizer
 *
 * Converts HTML string input into a stream of tokens that can be processed by a parser.
 * Handles various HTML elements including tags, attributes, text content, comments, etc.
 */
declare class HTMLTokenizer {
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
    constructor(input: string, options?: TokenizerOptions$1);
    /**
     * Tokenizes the input HTML string
     *
     * @returns A result object containing tokens and any errors encountered
     */
    tokenize(): TokenizerResult$1;
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

/**
 * Enum-like object defining CSS token types
 */
declare const CSSTokenType: {
    readonly StartBlock: "StartBlock";
    readonly EndBlock: "EndBlock";
    readonly Semicolon: "Semicolon";
    readonly Colon: "Colon";
    readonly Comma: "Comma";
    readonly Selector: "Selector";
    readonly PseudoClass: "PseudoClass";
    readonly PseudoElement: "PseudoElement";
    readonly Combinator: "Combinator";
    readonly Property: "Property";
    readonly Value: "Value";
    readonly Unit: "Unit";
    readonly Number: "Number";
    readonly Color: "Color";
    readonly URL: "URL";
    readonly String: "String";
    readonly Function: "Function";
    readonly OpenParen: "OpenParen";
    readonly CloseParen: "CloseParen";
    readonly AtKeyword: "AtKeyword";
    readonly Comment: "Comment";
    readonly Whitespace: "Whitespace";
    readonly EOF: "EOF";
    readonly Error: "Error";
};
declare type TokenType = typeof CSSTokenType[keyof typeof CSSTokenType];

/**
 * Position information for tokens
 */
interface Position {
    line: number;
    column: number;
    offset?: number;
}
/**
 * Metadata for tokens including state minimization information
 */
interface TokenMetadata {
    stateSignature?: string;
    equivalenceClass?: number | null;
    transitions?: Map<string, CSSToken>;
    [key: string]: any;
}
/**
 * CSS Token with support for state minimization
 */
declare class CSSToken {
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

/**
 * Metadata for CSS AST nodes
 */
interface CSSNodeMetadata {
    equivalenceClass?: number | null;
    isMinimized?: boolean;
    [key: string]: any;
}
/**
 * CSS AST Node
 * Represents a node in the CSS Abstract Syntax Tree
 */
declare class CSSNode {
    readonly type: string;
    value: string | null;
    children: CSSNode[];
    parent: CSSNode | null;
    metadata: CSSNodeMetadata;
    constructor(type: string, value?: string | null);
    /**
     * Adds a child node
     */
    addChild(child: CSSNode): void;
    /**
     * Creates a deep clone of this node
     */
    clone(): CSSNode;
    /**
     * Gets a string representation of this node and its children
     */
    toString(indent?: number): string;
    /**
     * Finds all descendant nodes of a specific type
     */
    findAllByType(type: string): CSSNode[];
}

/**
 * CSS AST metadata
 */
interface CSSASTMetadata {
    optimizationMetrics?: {
        originalNodeCount: number;
        minimizedNodeCount: number;
        optimizationRatio: number;
    };
    [key: string]: any;
}
/**
 * CSS Abstract Syntax Tree
 * Represents a complete CSS document structure
 */
declare class CSSAST {
    /**
     * The root node of the AST
     */
    readonly root: CSSNode;
    /**
     * Metadata for the AST
     */
    metadata: CSSASTMetadata;
    /**
     * Creates a new CSS AST
     *
     * @param root - The root node
     * @param metadata - AST metadata
     */
    constructor(root: CSSNode, metadata?: CSSASTMetadata);
    /**
     * Builds an AST from a list of tokens
     *
     * @param tokens - The tokens to parse
     * @returns A new CSS AST
     */
    static fromTokens(tokens: CSSToken[]): CSSAST;
    /**
     * Creates a deep clone of the AST
     *
     * @returns A cloned AST
     */
    clone(): CSSAST;
    /**
     * Gets a string representation of the AST
     *
     * @returns A string representation
     */
    toString(): string;
    /**
     * Computes the size of the AST
     *
     * @returns The number of nodes in the AST
     */
    getSize(): number;
    /**
     * Recursively counts nodes in the AST
     *
     * @param node - The starting node
     * @returns The number of nodes
     */
    private countNodes;
    /**
     * Finds all nodes of a specific type
     *
     * @param type - The type to search for
     * @returns An array of matching nodes
     */
    findNodesByType(type: string): CSSNode[];
    /**
     * Finds nodes by value
     *
     * @param value - The value to search for
     * @returns An array of matching nodes
     */
    findNodesByValue(value: string): CSSNode[];
    /**
     * Performs a depth-first traversal of the AST
     *
     * @param callback - Function to call for each node
     */
    traverse(callback: (node: CSSNode) => void): void;
}

/**
 * CSS Parser Error
 * Represents an error that occurred during parsing
 */
declare class CSSParserError extends Error {
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

/**
 * Parser options
 */
interface CSSParserOptions {
    errorRecovery?: boolean;
    preserveComments?: boolean;
    strict?: boolean;
}
/**
 * CSS Parser
 * Parses tokens into an AST
 */
declare class CSSParser {
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

/**
 * Optimization options
 */
interface OptimizationOptions {
    mergeAdjacentValues?: boolean;
    removeEmptyNodes?: boolean;
    removeComments?: boolean;
    optimizeAttributes?: boolean;
    level?: 'minimal' | 'standard' | 'aggressive';
}
/**
 * CSS AST Optimizer
 * Implements state machine minimization techniques for CSS ASTs
 */
declare class CSSAstOptimizer {
    /**
     * State equivalence classes
     */
    private stateClasses;
    /**
     * Node signatures map
     */
    private nodeSignatures;
    /**
     * Minimized nodes cache
     */
    private minimizedNodes;
    /**
     * Creates a new AST optimizer
     */
    constructor();
    /**
     * Optimizes a CSS AST using state minimization techniques
     *
     * @param ast - The AST to optimize
     * @param options - Optimization options
     * @returns The optimized AST
     */
    optimize(ast: CSSAST, options?: OptimizationOptions): CSSAST;
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
    private buildStateClasses;
    /**
     * Computes a signature for a node based on its type, value, and children
     * This signature is used to identify equivalent nodes
     *
     * @param node - The node to compute a signature for
     * @returns The node signature
     */
    private computeNodeSignature;
    /**
     * Optimizes a node and its children
     * This is the second phase of the optimization process
     *
     * @param node - The node to optimize
     * @param options - Optimization options
     * @returns The optimized node
     */
    private optimizeNode;
    /**
     * Optimizes an array of child nodes
     * Applies various optimizations based on the options
     *
     * @param children - The children to optimize
     * @param options - Optimization options
     * @returns The optimized children
     */
    private optimizeChildren;
    /**
     * Merges adjacent value nodes
     * This helps reduce the number of nodes in the AST
     *
     * @param children - The children to merge
     * @returns The merged children
     */
    private mergeAdjacentValues;
    /**
     * Applies memory optimizations to a node tree
     * This is the third phase of the optimization process
     *
     * @param node - The node to optimize
     */
    private applyMemoryOptimizations;
    /**
     * Computes optimization metrics by comparing original and optimized ASTs
     *
     * @param originalRoot - The original root node
     * @param optimizedRoot - The optimized root node
     * @returns Optimization metrics
     */
    private computeOptimizationMetrics;
    /**
     * Collects metrics about a node and its children
     *
     * @param node - The node to analyze
     * @param metrics - The metrics object to update
     * @returns The updated metrics
     */
    private getNodeMetrics;
    /**
     * Estimates the memory usage of a node in bytes
     *
     * @param node - The node to analyze
     * @returns Estimated memory usage in bytes
     */
    private estimateNodeMemory;
}

/**
 * Options for CSS tokenization
 */
interface TokenizerOptions {
    preserveWhitespace?: boolean;
    recognizeColors?: boolean;
    recognizeFunctions?: boolean;
    generateStateTransitions?: boolean;
}
/**
 * Tokenizer result
 */
interface TokenizerResult {
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
declare class CSSTokenizer {
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

export { AST, CSSAST, CSSAstOptimizer, CSSNode, CSSParser, CSSToken, CSSTokenizer, CodeGenerator, CompilationUnit, ConfigOptions, DOMASM, DOMElement, DOMElementNode, DOMNode, DOMTextNode, DOMWalker, DiffOperation, DiffPatchEngine, DiffResult, Differ, DomASM, HTMLAstOptimizer, HTMLParser, HTMLParserError, HTMLTokenizer, HTMLVNode, Logger, Node$1 as Node, OptimizationMetrics, OptimizationOptions$1 as OptimizationOptions, Optimizer, Parser, PatchOperation, PatchResult, Patcher, Position$1 as Position, Renderer, Rule, State, StateMachine, StateMachineMinimizer, Token, TokenStream, Tokenizer, Traverser, VNodeBase, Visitor, addState, addTransition, createState, createStateMachine, diff, isAccepting, optimize, parse, patch, process, render, reset, transition, updateDOM };
