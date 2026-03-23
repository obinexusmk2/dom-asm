import { Node, AST } from '../core/types';
/**
 * Represents a difference between two ASTs
 */
export interface Diff {
    type: 'ADD' | 'REMOVE' | 'UPDATE' | 'REPLACE' | 'MOVE';
    path: number[];
    node?: Node;
    changes?: Record<string, any>;
    from?: number[];
    to?: number[];
}
/**
 * Represents a patch operation to be applied to the DOM
 */
export interface Patch {
    type: 'CREATE' | 'UPDATE' | 'REPLACE' | 'REMOVE' | 'MOVE';
    path: number[];
    node?: Node;
    attributes?: Record<string, any>;
    from?: number[];
    to?: number[];
}
/**
 * Options for the diffing algorithm
 */
export interface DiffOptions {
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
export declare class DiffPatchEngine {
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
    patch(domNode: Node, patches: Patch[]): Node;
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
