import { HTMLParser } from './html/parsing/HTMLParser';
import { HTMLAstOptimizer } from './html/ast/HTMLAstOptimizer';
import { DiffPatchEngine } from './diff-patch/DiffPatchEngine';
import { HTMLVNode } from './html/ast/Node';
import { Node as ASTNode, AST, OptimizationOptions } from './core/types';

/**
 * DomASM Main API
 *
 * Provides a unified interface to the DOM ASM functionality,
 * including parsing, optimization, diffing, patching, and rendering.
 */
export class DomASM {
  private parser: HTMLParser;
  private optimizer: HTMLAstOptimizer;
  private diffPatcher: DiffPatchEngine;

  constructor() {
    this.parser = new HTMLParser();
    this.optimizer = new HTMLAstOptimizer();
    this.diffPatcher = new DiffPatchEngine();
  }

  public parse(input: string): AST {
    return this.parser.parse(input);
  }

  public optimize(ast: AST, _options?: OptimizationOptions): AST {
    return this.optimizer.optimize(ast);
  }

  public diff(oldAst: AST, newAst: AST): any[] {
    return this.diffPatcher.diff(oldAst, newAst);
  }

  public patch(ast: AST, patches: any[]): ASTNode {
    return this.diffPatcher.patch(ast.root, this.diffPatcher.generatePatches(patches));
  }

  public render(ast: AST): any {
    return this.convertToVNode(ast.root).toDOM();
  }

  private convertToVNode(node: ASTNode): HTMLVNode {
    if (node.type === 'Text') {
      return HTMLVNode.createText(node.value || '');
    }

    const props: any = {};
    if (node.attributes) {
      node.attributes.forEach((value: string, key: string) => {
        props[key] = value;
      });
    }

    const children = (node.children || []).map((child: ASTNode) => this.convertToVNode(child));

    return new HTMLVNode(node.name || node.type, props, children);
  }

  public process(input: string): any {
    const ast = this.parse(input);
    const optimizedAst = this.optimize(ast);
    return this.render(optimizedAst);
  }

  public updateDOM(domNode: any, newHTML: string): any {
    const oldVNode = HTMLVNode.fromDOM(domNode);
    const ast = this.parse(newHTML);
    const optimizedAst = this.optimize(ast);
    const newVNode = this.convertToVNode(optimizedAst.root);
    const diffs = this.diffVNodes(oldVNode, newVNode);
    const patches = this.generateVNodePatches(diffs);
    return this.applyVNodePatches(domNode, patches);
  }

  private diffVNodes(oldNode: HTMLVNode, newNode: HTMLVNode): any[] {
    const oldAst = { root: this.convertToASTNode(oldNode), metadata: {} };
    const newAst = { root: this.convertToASTNode(newNode), metadata: {} };
    return this.diffPatcher.diff(oldAst, newAst);
  }

  private convertToASTNode(vnode: HTMLVNode): ASTNode {
    const node: ASTNode = {
      type: vnode.type === '#text' ? 'Text' : 'Element',
      children: []
    };

    if (vnode.type !== '#text') {
      node.name = vnode.type;
    }

    if (vnode.type === '#text') {
      node.value = vnode.props.textContent || '';
    } else {
      const attributes = new Map<string, string>();
      Object.entries(vnode.props).forEach(([key, value]) => {
        if (key !== 'children' && key !== 'textContent') {
          attributes.set(key, String(value));
        }
      });
      node.attributes = attributes;
    }

    node.children = vnode.children.map((child: HTMLVNode) => this.convertToASTNode(child));

    return node;
  }

  private generateVNodePatches(diffs: any[]): any[] {
    return this.diffPatcher.generatePatches(diffs);
  }

  private applyVNodePatches(domNode: any, patches: any[]): any {
    const astNode = this.convertToASTNode(HTMLVNode.fromDOM(domNode));
    const patchedNode = this.diffPatcher.patch(astNode, patches);
    return this.convertToVNode(patchedNode).toDOM();
  }
}

// Export convenience functions
export function parse(html: string): AST {
  return new DomASM().parse(html);
}

export function render(ast: AST): any {
  return new DomASM().render(ast);
}

export function process(html: string): any {
  return new DomASM().process(html);
}

export function optimize(ast: AST, options?: OptimizationOptions): AST {
  return new DomASM().optimize(ast, options);
}

export function diff(oldAst: AST, newAst: AST): any[] {
  return new DomASM().diff(oldAst, newAst);
}

export function patch(ast: AST, patches: any[]): ASTNode {
  return new DomASM().patch(ast, patches);
}

export function updateDOM(domNode: any, newHTML: string): any {
  return new DomASM().updateDOM(domNode, newHTML);
}
