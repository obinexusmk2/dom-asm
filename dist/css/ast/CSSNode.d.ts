/**
 * Metadata for CSS AST nodes
 */
export interface CSSNodeMetadata {
    equivalenceClass?: number | null;
    isMinimized?: boolean;
    [key: string]: any;
}
/**
 * CSS AST Node
 * Represents a node in the CSS Abstract Syntax Tree
 */
export declare class CSSNode {
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
