/**
 * enviroment.ts
 * This file defines the runtime environment for a custom programming language.
 * It includes the implementation of the `Enviroment` class, which is responsible for
 * variable storage and lookup, and the `createGlobalEnv` function, which initializes
 * the global environment with predefined variables and native functions.
 */

import {
  MAKE_BOOL,
  MAKE_NATIVE_FN,
  MAKE_NULL,
  MAKE_NUMBER,
  RuntimeVal,
} from "./value";

/**
 * Creates and initializes the global environment with predefined variables and native functions.
 *
 * The following variables are declared in the global environment:
 * - `true`: A boolean value representing true.
 * - `false`: A boolean value representing false.
 * - `null`: A null value.
 * - `print`: A native function that prints its arguments to the console.
 * - `time`: A native function that returns the current timestamp in milliseconds.
 *
 * @returns {Enviroment} The initialized global environment.
 */
export const createGlobalEnv = () => {
  const env = new Enviroment();
  env.declareVar("true", MAKE_BOOL(true), true);
  env.declareVar("false", MAKE_BOOL(false), true);
  env.declareVar("null", MAKE_NULL(), true);
  // define native method
  env.declareVar(
    "print",
    MAKE_NATIVE_FN((args, scope) => {
      console.log(...args);
      return MAKE_NULL();
    }),
    true
  );

  const TimeFunction = (args: RuntimeVal[], env: Enviroment) => {
    return MAKE_NUMBER(Date.now());
  };

  env.declareVar("time", MAKE_NATIVE_FN(TimeFunction), true);
  return env;
};

/**
 * this class represents an environment for variable storage and lookup.
 * Supports nested environments with a parent-child relationship.
 */
export default class Enviroment {
  private parent?: Enviroment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  /**
   * Creates an instance of Enviroment.
   * @param parentENV - The parent environment, if any.
   */
  constructor(parentENV?: Enviroment) {
    const envGlobal = parentENV ? true : false;
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

  /**
   * Declares a variable in the current environment.
   * @param varname - The name of the variable.
   * @param value - The value of the variable.
   * @param constant - Whether the variable is a constant.
   * @returns The value of the declared variable.
   * @throws {Error} If the variable is already declared in this scope.
   */
  public declareVar(
    varname: string,
    value: RuntimeVal,
    constant: boolean
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw new Error(`Variable: ${varname} already declared in this scope`);
    }
    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }

  /**
   * Looks up a variable in the current environment or parent environments.
   * @param varname - The name of the variable.
   * @returns The value of the variable.
   * @throws {Error} If the variable cannot be resolved.
   */
  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  /**
   * Assigns a value to an existing variable in the current environment or parent environments.
   * @param varname - The name of the variable.
   * @param value - The new value of the variable.
   * @returns The new value of the variable.
   * @throws {Error} If the variable is a constant or cannot be resolved.
   */
  public asignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);
    if (env.constants.has(varname)) {
      throw new Error(`Cannot reassign constant variable: ${varname}`);
    }
    env.variables.set(varname, value);
    return value;
  }

  /**
   * Resolves the environment in which a variable is declared.
   * @param varname - The name of the variable.
   * @returns The environment in which the variable is declared.
   * @throws {Error} If the variable cannot be resolved.
   */
  public resolve(varname: string): Enviroment {
    if (this.variables.has(varname)) {
      return this;
    }
    if (this.parent == undefined) {
      throw new Error(
        `cannot resolve variable: ${varname} as it does not exist `
      );
    }
    return this.parent.resolve(varname);
  }
}
