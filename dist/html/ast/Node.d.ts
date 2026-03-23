import { Node } from '../core/types';
/**
 * Core HTML node property types
 */
export interface HTMLVNodeProps {
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
export interface HTMLVNodeState {
    id: number;
    transitions: Map<string, HTMLVNodeState>;
    isMinimized: boolean;
    equivalenceClass: number | null;
}
/**
 * Metadata for node analysis and optimization
 */
export interface HTMLNodeMetadata {
    equivalenceClass: number;
    stateSignature: string;
    isMinimized: boolean;
    metrics: {
        commentCount: number;
        textCount: number;
        nodeCount: number;
    };
}
/**
 * Core HTML node structure
 */
export interface HTMLNode {
    type: string;
    name?: string;
    value?: string;
    attributes?: Map<string, string>;
    children: HTMLNode[];
    metadata: HTMLNodeMetadata;
}
/**
 * Base class for virtual DOM nodes
 */
export declare abstract class VNodeBase {
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
export declare class HTMLVNode extends VNodeBase {
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
