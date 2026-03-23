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
export class CSSNode {
  public readonly type: string;
  public value: string | null;
  public children: CSSNode[];
  public parent: CSSNode | null;
  public metadata: CSSNodeMetadata;

  constructor(type: string, value: string | null = null) {
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
  public addChild(child: CSSNode): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Creates a deep clone of this node
   */
  public clone(): CSSNode {
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
  public toString(indent: number = 0): string {
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
  public findAllByType(type: string): CSSNode[] {
    const result: CSSNode[] = [];

    if (this.type === type) {
      result.push(this);
    }

    for (const child of this.children) {
      result.push(...child.findAllByType(type));
    }

    return result;
  }
}
