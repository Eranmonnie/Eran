import { Stmt } from "../frontend/ast";
import Enviroment from "./enviroment";

export type ValueTypes =
  | "null"
  | "number"
  | "boolean"
  | "object"
  | "native-fn"
  | "function";

export const MAKE_NUMBER = (value: number = 0): NumberVal => {
  return { type: "number", value } as NumberVal;
};

export const MAKE_NULL = (): NullVal => {
  return { type: "null", value: null } as NullVal;
};

export const MAKE_BOOL = (type: boolean) => {
  return { type: "boolean", value: type } as BoolVal;
};

export interface RuntimeVal {
  type: ValueTypes;
}

export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}
export interface BoolVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}

export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<string, RuntimeVal>;
}

export type FunctionCall = (args: RuntimeVal[], env: Enviroment) => RuntimeVal;

export interface NativeFnValues extends RuntimeVal {
  type: "native-fn";
  call: FunctionCall;
}

export interface FunctionValues extends RuntimeVal {
  type: "function";
  name: string;
  parameters: string[];
  declarationEnv: Enviroment;
  body: Stmt[];
}

export const MAKE_NATIVE_FN = (call: FunctionCall) => {
  return { type: "native-fn", call } as NativeFnValues;
};
