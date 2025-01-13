export type NodeType =
  // STATEMENTS
  | "Program"
  | "VariableDeclaration"
  | "FunctionDeclaration"

  // EXPRESSIONS
  | "AssignmentExpr"
  | "MemberExpr"
  | "CallExpr"

  // LITERALS
  | "Property"
  | "ObjectLiteral"
  | "NumericLiteral"
  | "NullLiteral"
  | "Identifier"
  | "BinaryExpr";
//   | "CallExpr"
//   | "UniaryExpr"
//   | "functionDeclaration";

export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}
export interface CallExpr extends Expr {
  kind: "CallExpr";
  args: Expr[];
  caller: Expr;
}
export interface MemberExpr extends Expr {
  kind: "MemberExpr";
  object: Expr;
  property: Expr;
  computed: boolean;
}

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

export interface NullLiteral extends Expr {
  kind: "NullLiteral";
  value: "null";
}

export interface VariableDeclaration extends Stmt {
  kind: "VariableDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expr;
}

export interface FunctionDelaration extends Stmt {
  kind: "FunctionDeclaration";
  params: string[];
  name: string;
  body: Stmt[];
  // async:boolean
  // arrow:boolean;
}

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  asignee: Expr;
  value?: Expr;
}

export interface Property extends Expr {
  kind: "Property";
  key: string;
  value?: Expr;
}

export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: Property[];
}
