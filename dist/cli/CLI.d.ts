import { Node, AST, OptimizationOptions } from './core/types';
/**
 * DomASM Main API
 *
 * Provides a unified interface to the DOM ASM functionality,
 * including parsing, optimization, diffing, patching, and rendering.
 */
export declare class DomASM {
    private parser;
    private optimizer;
    private diffPatcher;
    /**
     * Creates a new DomASM instance
     */
    constructor();
    /**
     * Parses an HTML string into an AST
     *
     * @param input - The HTML string to parse
     * @returns The parsed AST
     */
    parse(input: string): AST;
    /**
     * Optimizes an AST
     *
     * @param ast - The AST to optimize
     * @param options - Optimization options
     * @returns The optimized AST
     */
    optimize(ast: AST, options?: OptimizationOptions): AST;
    /**
     * Computes differences between two ASTs
     *
     * @param oldAst - The original AST
     * @param newAst - The new AST
     * @returns The differences
     */
    diff(oldAst: AST, newAst: AST): any[];
    /**
     * Applies patches to an AST
     *
     * @param ast - The AST to patch
     * @param patches - The patches to apply
     * @returns The patched AST
     */
    patch(ast: AST, patches: any[]): Node;
    /**
     * Renders an AST to a DOM element
     *
     * @param ast - The AST to render
     * @returns The DOM node
     */
    render(ast: AST): Node;
    /**
     * Converts an AST node to a VNode
     *
     * @param node - The AST node to convert
     * @returns The VNode
     */
    private convertToVNode;
    /**
     * Performs the complete pipeline: parse, optimize, and render
     *
     * @param input - The HTML string to process
     * @returns The processed DOM node
     */
    process(input: string): Node;
    /**
     * Updates an existing DOM node with new HTML
     *
     * @param domNode - The DOM node to update
     * @param newHTML - The new HTML
     * @returns The updated DOM node
     */
    updateDOM(domNode: Node, newHTML: string): Node;
    /**
     * Computes differences between two VNodes
     *
     * @param oldNode - The original VNode
     * @param newNode - The new VNode
     * @returns The differences
     */
    private diffVNodes;
    /**
     * Converts a VNode to an AST node
     *
     * @param vnode - The VNode to convert
     * @returns The AST node
     */
    private convertToASTNode;
    /**
     * Generates patches for VNodes
     *
     * @param diffs - The differences
     * @returns The patches
     */
    private generateVNodePatches;
    /**
     * Applies patches to a DOM node
     *
     * @param domNode - The DOM node to patch
     * @param patches - The patches to apply
     * @returns The patched DOM node
     */
    private applyVNodePatches;
}
export declare function parse(html: string): AST;
export declare function render(ast: AST): Node;
export declare function process(html: string): Node;
export declare function optimize(ast: AST, options?: OptimizationOptions): AST;
export declare function diff(oldAst: AST, newAst: AST): any[];
export declare function patch(ast: AST, patches: any[]): Node;
export declare function updateDOM(domNode: Node, newHTML: string): Node;
