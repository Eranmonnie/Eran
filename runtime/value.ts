
/**
 * value.ts
 * This file defines various types and utility functions for representing and manipulating values in the runtime environment of the programming language.
 * It includes definitions for different value types such as numbers, booleans, null, objects, and functions, as well as functions to create instances of these values.
 * Additionally, it provides interfaces for runtime values and their specific implementations.
 */

import { Stmt } from "../frontend/ast";
import Enviroment from "./enviroment";

/**
 * Represents the possible types of values in the runtime.
 * 
 * The `ValueTypes` type can be one of the following:
 * - `"null"`: Represents a null value.
 * - `"number"`: Represents a numeric value.
 * - `"boolean"`: Represents a boolean value (true or false).
 * - `"object"`: Represents an object value.
 * - `"native-fn"`: Represents a native function.
 * - `"function"`: Represents a user-defined function.
 */
export type ValueTypes =
  | "null"
  | "number"
  | "boolean"
  | "object"
  | "native-fn"
  | "function";

/**
 * Creates a NumberVal object with the specified value.
 *
 * @param {number} [value=0] - The numeric value to be assigned. Defaults to 0 if not provided.
 * @returns {NumberVal} An object representing a number with the specified value.
 */
export const MAKE_NUMBER = (value: number = 0): NumberVal => {
  return { type: "number", value } as NumberVal;
};

/**
 * Creates a NullVal object with type "null" and value null.
 *
 * @returns {NullVal} An object representing a null value.
 */
export const MAKE_NULL = (): NullVal => {
  return { type: "null", value: null } as NullVal;
};

/**
 * Creates a BoolVal object with the specified value.
 *
 * @param {boolean} type - The boolean value to be assigned.
 * @returns {BoolVal} An object representing a boolean with the specified value.
 */
export const MAKE_BOOL = (type: boolean) => {
  return { type: "boolean", value: type } as BoolVal;
};


/**
 * Represents a runtime value.
 * 
 * @interface RuntimeVal
 * 
 * @property {ValueTypes} type - The type of the value.
 */
export interface RuntimeVal {
  type: ValueTypes;
}


/**
 * Represents a null value in the runtime.
 * 
 * @interface NullVal
 * @extends {RuntimeVal}
 * 
 * @property {string} type - The type of the value, which is "null".
 * @property {null} value - The value of the null value, which is always null.
 */
export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

/**
 * Represents a number value in the runtime.
 * 
 * @interface NumberVal
 * @extends {RuntimeVal}
 * 
 * @property {string} type - The type of the value, which is "number".
 * @property {number} value - The numeric value.
 */
export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

/**
 * Represents a boolean value in the runtime.
 * 
 * @interface BoolVal
 * @extends {RuntimeVal}
 * 
 * @property {string} type - The type of the value, which is "boolean".
 * @property {boolean} value - The boolean value.
 */
export interface BoolVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}

/**
 * Represents an object value in the runtime.
 * 
 * @interface ObjectVal
 * @extends {RuntimeVal}
 * 
 * @property {string} type - The type of the value, which is "object".
 * @property {Map<string, RuntimeVal>} properties - A map containing the properties of the object, where each key is a string and each value is a RuntimeVal.
 */
export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<string, RuntimeVal>;
}

/**
 * Represents a function call in the runtime environment.
 *
 * @callback FunctionCall
 * @param {RuntimeVal[]} args - The arguments passed to the function.
 * @param {Enviroment} env - The environment in which the function is executed.
 * @returns {RuntimeVal} - The result of the function execution.
 */
export type FunctionCall = (args: RuntimeVal[], env: Enviroment) => RuntimeVal;

/**
 * Represents a native function value in the runtime.
 * 
 * @interface NativeFnValues
 * @extends {RuntimeVal}
 * 
 * @property {string} type - The type of the runtime value, which is always "native-fn" for this interface.
 * @property {FunctionCall} call - The function call associated with this native function value.
 */
export interface NativeFnValues extends RuntimeVal {
  type: "native-fn";
  call: FunctionCall;
}

/**
 * Represents the values associated with a function in the runtime environment.
 * 
 * @interface FunctionValues
 * @extends RuntimeVal
 * 
 * @property {string} type - The type of the runtime value, which is always "function" for this interface.
 * @property {string} name - The name of the function.
 * @property {string[]} parameters - The list of parameter names for the function.
 * @property {Enviroment} declarationEnv - The environment in which the function was declared.
 * @property {Stmt[]} body - The body of the function, represented as an array of statements.
 */
export interface FunctionValues extends RuntimeVal {
  type: "function";
  name: string;
  parameters: string[];
  declarationEnv: Enviroment;
  body: Stmt[];
}

/**
 * Creates a native function value with the specified function call.
 *
 * @param {FunctionCall} call - The function call to be associated with the native function.
 * @returns {NativeFnValues} An object representing a native function value.
 */
export const MAKE_NATIVE_FN = (call: FunctionCall) => {
  return { type: "native-fn", call } as NativeFnValues;
};
