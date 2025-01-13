import {
  FunctionDelaration,
  Program,
  VariableDeclaration,
} from "../../frontend/ast";
import Enviroment from "../enviroment";
import { evaluate } from "../interpreter";
import { FunctionValues, MAKE_NULL, RuntimeVal } from "../value";

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

export const eval_var_declearation = (
  declaration: VariableDeclaration,
  env: Enviroment
): RuntimeVal => {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : MAKE_NULL();
  return env.declareVar(declaration.identifier, value, declaration.constant);
};

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
