import {
  MAKE_BOOL,
  MAKE_NATIVE_FN,
  MAKE_NULL,
  MAKE_NUMBER,
  RuntimeVal,
} from "./value";

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

export default class Enviroment {
  private parent?: Enviroment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentENV?: Enviroment) {
    const envGlobal = parentENV ? true : false;
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

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

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  public asignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);
    if (env.constants.has(varname)) {
      throw new Error(`Cannot reassign constant variable: ${varname}`);
    }
    env.variables.set(varname, value);
    return value;
  }

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
