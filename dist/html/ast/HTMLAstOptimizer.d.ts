import { AST } from '../../core/types';
/**
 * Interface for optimization metrics
 */
export interface OptimizationMetrics {
    nodeReduction: {
        original: number;
        optimized: number;
        ratio: number;
    };
    memoryUsage: {
        original: number;
        optimized: number;
        ratio: number;
    };
    stateClasses: {
        count: number;
        averageSize: number;
    };
}
/**
 * HTMLAstOptimizer
 * Optimizes AST (Abstract Syntax Tree) representations of HTML by identifying
 * and merging equivalent nodes, reducing redundancy while preserving semantics.
 */
export declare class HTMLAstOptimizer {
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
