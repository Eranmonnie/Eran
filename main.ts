
/**
 * main.ts
 * This is the main entry point for a custom programming language interpreter.
 * It can run programs from a file or start a Read-Eval-Print Loop (REPL) for interactive use.
 * 
 * Usage:
 * - To run a program from a file, call the `run` function with the file path as an argument.
 * - To start the REPL, call the `repl` function.
 */

import { Parser } from "./frontend/parser";
import Enviroment, { createGlobalEnv } from "./runtime/enviroment";
import { evaluate } from "./runtime/interpreter";
import { MAKE_NUMBER, MAKE_NULL, MAKE_BOOL } from "./runtime/value";
import fs from "fs";

run("text.txt");

/**
 * Runs a custom programming language program from a file.
 *
 * @async
 * @function run
 * @param {string} file - The path to the file containing the program.
 * @returns {Promise<void>} A promise that resolves when the program finishes running.
 */
async function run(file: string) {
  const parser = new Parser();
  const env = createGlobalEnv();
  const input = await fs.promises.readFile(file, "utf-8");
  const program = parser.produceAst(input);
  // console.log("ast", program)
  const result = evaluate(program, env);
  // console.log(result);
}

/**
 * Starts a Read-Eval-Print Loop (REPL) for the custom programming language.
 * The REPL reads input from the standard input, parses it, evaluates it, and prints the result.
 * It continues to run until the user inputs "exit" or an empty input.
 *
 * @async
 * @function repl
 * @returns {Promise<void>} A promise that resolves when the REPL exits.
 */
async function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();
  console.log("Repl v0.1");
  while (true) {
    process.stdout.write("> ");
    const input = await new Promise<string>((resolve) => {
      process.stdin.once("data", (data) => resolve(data.toString().trim()));
    });

    if (!input || input.includes("exit")) {
      console.log("Exiting repl...");
      process.exit(1);
    }

    const program = parser.produceAst(input);
    const result = evaluate(program, env);
    console.log(result);
  }
}
