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
import { eval_function_declaration, eval_var_declearation, evaluate_program } from "./eval/statements";
import {
  eval_assignment_expr,
  eval_identifier,
  eval_object_expr,
  evaluate_binary_expr,
  eval_call_expr,
} from "./eval/expressions";

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
