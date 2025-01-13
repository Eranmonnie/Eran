import { create } from "domain";
import { Parser } from "./frontend/parser";
import Enviroment, { createGlobalEnv } from "./runtime/enviroment";
import { evaluate } from "./runtime/interpreter";
import { MAKE_NUMBER, MAKE_NULL, MAKE_BOOL } from "./runtime/value";
import fs from "fs";

run("text.txt");

async function run(file: string) {
  const parser = new Parser();
  const env = createGlobalEnv();
  const input = await fs.promises.readFile(file, "utf-8");
  const program = parser.produceAst(input);
  // console.log("ast", program)
  const result = evaluate(program, env);
  // console.log(result);
}

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
