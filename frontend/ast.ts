/**
 * **ats.ts**
 * 
 * This file defines the Abstract Syntax Tree (AST) structure for a programming language.
 * The AST consists of nodes representing various constructs like statements, expressions, literals, and declarations.
 * These types are used to model the syntax and semantics of the programming language.
 */

/**
 * **NodeType**
 * 
 * A union of string literals representing the type of each AST node.
 */
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

/**
 * **Stmt**
 * 
 * The base interface for all statement nodes in the AST.
 * Each statement has a `kind` property indicating its type.
 */
export interface Stmt {
  kind: NodeType;
}

/**
 * **Program**
 * 
 * Represents the root node of the AST. Contains an array of statements.
 */
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

/**
 * **Expr**
 * 
 * The base interface for all expression nodes. Extends `Stmt` as expressions can also be statements.
 */
export interface Expr extends Stmt {}

/**
 * **BinaryExpr**
 * 
 * Represents a binary operation (e.g., addition, subtraction).
 */
export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;         // Left operand
  right: Expr;        // Right operand
  operator: string;   // Binary operator (e.g., `+`, `-`, `*`, `/`)
}

/**
 * **CallExpr**
 * 
 * Represents a function or method call.
 */
export interface CallExpr extends Expr {
  kind: "CallExpr";
  args: Expr[];       // List of arguments
  caller: Expr;       // Function or method being called
}

/**
 * **MemberExpr**
 * 
 * Represents access to a member of an object (e.g., `object.property`).
 */
export interface MemberExpr extends Expr {
  kind: "MemberExpr";
  object: Expr;       // The object being accessed
  property: Expr;     // The property being accessed
  computed: boolean;  // True if accessed via brackets (e.g., `object["property"]`)
}

/**
 * **Identifier**
 * 
 * Represents a variable or symbol name.
 */
export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;     // The name of the identifier
}

/**
 * **NumericLiteral**
 * 
 * Represents a numeric value.
 */
export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;      // The numeric value
}

/**
 * **NullLiteral**
 * 
 * Represents a null value.
 */
export interface NullLiteral extends Expr {
  kind: "NullLiteral";
  value: "null";      // Always "null"
}

/**
 * **VariableDeclaration**
 * 
 * Represents the declaration of a variable.
 */
export interface VariableDeclaration extends Stmt {
  kind: "VariableDeclaration";
  constant: boolean;  // True if the variable is constant (e.g., `const`)
  identifier: string; // Name of the variable
  value?: Expr;       // Optional initial value
}

/**
 * **FunctionDelaration**
 * 
 * Represents a function declaration.
 */
export interface FunctionDelaration extends Stmt {
  kind: "FunctionDeclaration";
  params: string[];   // List of parameter names
  name: string;       // Function name
  body: Stmt[];       // Statements within the function body
}

/**
 * **AssignmentExpr**
 * 
 * Represents an assignment operation.
 */
export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  asignee: Expr;      // The variable or property being assigned to
  value?: Expr;       // The value being assigned
}

/**
 * **Property**
 * 
 * Represents a key-value pair in an object literal.
 */
export interface Property extends Expr {
  kind: "Property";
  key: string;        // Property key
  value?: Expr;       // Optional property value
}

/**
 * **ObjectLiteral**
 * 
 * Represents an object literal (e.g., `{ key: value }`).
 */
export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: Property[]; // List of properties in the object
}
