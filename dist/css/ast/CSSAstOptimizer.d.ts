import { CSSAST } from './CSSAST';
/**
 * Optimization options
 */
export interface OptimizationOptions {
    mergeAdjacentValues?: boolean;
    removeEmptyNodes?: boolean;
    removeComments?: boolean;
    optimizeAttributes?: boolean;
    level?: 'minimal' | 'standard' | 'aggressive';
}
/**
 * Optimization metrics
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
 * CSS AST Optimizer
 * Implements state machine minimization techniques for CSS ASTs
 */
export declare class CSSAstOptimizer {
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
