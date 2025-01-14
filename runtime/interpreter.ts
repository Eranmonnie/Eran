/**
 * interpreter.ts
 * This file contains the main interpreter logic for evaluating an abstract syntax tree (AST)
 * within a given environment. It imports various evaluation functions and AST node types,
 * and defines the `evaluate` function which dispatches the evaluation based on the type
 * of AST node.
 */

import { NumberVal, RuntimeVal, MAKE_NULL } from "./value";
import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  FunctionDelaration,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Stmt,
  VariableDeclaration,
} from "../frontend/ast";
import Enviroment from "./enviroment";
import {
  eval_function_declaration,
  eval_var_declearation,
  evaluate_program,
} from "./eval/statements";
import {
  eval_assignment_expr,
  eval_identifier,
  eval_object_expr,
  evaluate_binary_expr,
  eval_call_expr,
} from "./eval/expressions";

/**
 * Evaluates an abstract syntax tree (AST) node within a given environment.
 *
 * @param astNode - The AST node to evaluate. This can be of various types such as:
 *   - "NumericLiteral": A numeric literal node.
 *   - "NullLiteral": A null literal node.
 *   - "Identifier": An identifier node.
 *   - "ObjectLiteral": An object literal node.
 *   - "CallExpr": A call expression node.
 *   - "BinaryExpr": A binary expression node.
 *   - "Program": A program node.
 *   - "VariableDeclaration": A variable declaration node.
 *   - "FunctionDeclaration": A function declaration node.
 *   - "AssignmentExpr": An assignment expression node.
 * @param env - The environment in which to evaluate the AST node.
 *
 * @returns The evaluated runtime value of the AST node.
 *
 * @throws Will throw an error if the AST node kind is not set up for evaluation.
 */
export const evaluate = (astNode: Stmt, env: Enviroment): RuntimeVal => {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        type: "number",
        value: (astNode as NumericLiteral).value,
      } as NumberVal;

    case "NullLiteral":
      return MAKE_NULL();

    case "Identifier":
      return eval_identifier(astNode as Identifier, env);

    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, env);

    case "CallExpr":
      return eval_call_expr(astNode as CallExpr, env);

    case "BinaryExpr":
      return evaluate_binary_expr(astNode as BinaryExpr, env);

    case "Program":
      return evaluate_program(astNode as Program, env);

    case "VariableDeclaration":
      return eval_var_declearation(astNode as VariableDeclaration, env);

    case "FunctionDeclaration":
      return eval_function_declaration(astNode as FunctionDelaration, env);

    case "AssignmentExpr":
      return eval_assignment_expr(astNode as AssignmentExpr, env);

    default:
      console.error("not set up : \n", astNode);
      process.exit(1);
  }
};
