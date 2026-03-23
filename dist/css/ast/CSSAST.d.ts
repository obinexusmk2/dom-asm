import { CSSNode } from './CSSNode';
import { CSSToken } from '../tokenization/CSSToken';
/**
 * CSS AST metadata
 */
export interface CSSASTMetadata {
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
export declare class CSSAST {
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
