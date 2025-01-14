/**
 * statements.ts
 * This module contains functions to evaluate different types of statements in a programming language runtime.
 * It includes functions to evaluate programs, variable declarations, and function declarations.
 * The evaluations are performed within a given environment, which manages variable and function scopes.
 */

import {
  FunctionDelaration,
  Program,
  VariableDeclaration,
} from "../../frontend/ast";
import Enviroment from "../enviroment";
import { evaluate } from "../interpreter";
import { FunctionValues, MAKE_NULL, RuntimeVal } from "../value";

/**
 * Evaluates a given program by iterating through its statements and evaluating each one in the provided environment.
 * 
 * @param program - The program to be evaluated, represented as an instance of the `Program` type.
 * @param env - The environment in which the program is evaluated, represented as an instance of the `Enviroment` type.
 * @returns The result of the last evaluated statement in the program, represented as a `RuntimeVal`.
 */
export const evaluate_program = (
  program: Program,
  env: Enviroment
): RuntimeVal => {
  let lastEval: RuntimeVal = MAKE_NULL();
  for (const statement of program.body) {
    lastEval = evaluate(statement, env);
  }
  return lastEval;
};

/**
 * Evaluates a variable declaration and assigns its value in the given environment.
 *
 * @param declaration - The variable declaration to evaluate. It contains the identifier, value, and a flag indicating if it's a constant.
 * @param env - The environment in which the variable is to be declared.
 * @returns The runtime value of the declared variable.
 */
export const eval_var_declearation = (
  declaration: VariableDeclaration,
  env: Enviroment
): RuntimeVal => {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : MAKE_NULL();
  return env.declareVar(declaration.identifier, value, declaration.constant);
};

/**
 * Evaluates a function declaration and adds it to the environment.
 *
 * @param declaration - The function declaration to evaluate.
 * @param env - The environment in which the function is declared.
 * @returns The runtime value of the declared function.
 */
export const eval_function_declaration = (
  declaration: FunctionDelaration,
  env: Enviroment
): RuntimeVal => {
  const fn = {
    type: "function",
    name: declaration.name,
    parameters: declaration.params,
    declarationEnv: env,
    body: declaration.body,
  } as FunctionValues;
  return env.declareVar(declaration.name, fn, true);
};
