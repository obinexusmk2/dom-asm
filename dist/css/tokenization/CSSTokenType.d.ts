/**
 * Enum-like object defining CSS token types
 */
export declare const CSSTokenType: {
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
export declare type TokenType = typeof CSSTokenType[keyof typeof CSSTokenType];
