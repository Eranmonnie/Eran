import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Expr,
  Identifier,
  ObjectLiteral,
  VariableDeclaration,
} from "../../frontend/ast";
import Enviroment from "../enviroment";
import { evaluate } from "../interpreter";
import {
  FunctionValues,
  MAKE_NULL,
  NativeFnValues,
  NumberVal,
  ObjectVal,
  RuntimeVal,
} from "../value";

export const evaluate_numeric_binary_expr = (
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string
): NumberVal => {
  let result: number = 0;
  if (operator == "+") {
    result = lhs.value + rhs.value;
  } else if (operator == "-") {
    result = lhs.value - rhs.value;
  } else if (operator == "*") {
    result = lhs.value * rhs.value;
  } else if (operator == "/") {
    // TODO division by zero checks
    result = lhs.value / rhs.value;
  } else if (operator == "%") {
    result = lhs.value % rhs.value;
  }

  return { type: "number", value: result };
};

export const evaluate_binary_expr = (
  binop: BinaryExpr,
  env: Enviroment
): RuntimeVal => {
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);
  if (lhs.type == "number" && rhs.type == "number") {
    return evaluate_numeric_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator
    );
  } else {
    return MAKE_NULL();
  }
};

export const eval_identifier = (
  ident: Identifier,
  env: Enviroment
): RuntimeVal => {
  const val = env.lookupVar(ident.symbol);
  if (!val) {
    console.error("Identifier not found in enviroment:", ident.symbol);
    process.exit(1);
  }
  return val;
};

export const eval_object_expr = (
  node: ObjectLiteral,
  env: Enviroment
): RuntimeVal => {
  const object = { type: "object", properties: new Map() } as ObjectVal;
  for (const { key, value } of node.properties) {
    const runtimeVal =
      value == undefined ? env.lookupVar(key) : evaluate(value, env);
    object.properties.set(key, runtimeVal);
  }
  return object;
};

export const eval_assignment_expr = (
  node: AssignmentExpr,
  env: Enviroment
): RuntimeVal => {
  if (node.asignee.kind !== "Identifier") {
    throw new Error(
      `invalid assignment expression: ${JSON.stringify(node.asignee)}`
    );
  }
  const varName = (node.asignee as Identifier).symbol;
  const val = node.value as Expr;
  return env.asignVar(varName, evaluate(val, env));
};

export const eval_call_expr = (expr: CallExpr, env: Enviroment): RuntimeVal => {
  const args = expr.args.map((arg) => {
    return evaluate(arg, env);
  });
  const fn = evaluate(expr.caller, env);
  if (fn.type == "native-fn") {
    const result = (fn as NativeFnValues).call(args, env);
    return result;
  }

  if (fn.type == "function") {
    const func = fn as FunctionValues;
    const scope = new Enviroment(func.declarationEnv);
    //create variables for params list
    for (let i = 0; i < func.parameters.length; i++) {
      //TODO check bounds here
      // verify args in function
      const varName = func.parameters[i];
      scope.declareVar(varName, args[i], false);
    }

    let result: RuntimeVal = MAKE_NULL();
    for (const stmt of func.body) {
      result = evaluate(stmt, scope);
    }
    return result;
  } else {
    throw new Error(
      "cannot call value that is not a function " + JSON.stringify(fn)
    );
  }
};
