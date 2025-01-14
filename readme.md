# Custom Programming Language Interpreter (ERAN)

This project is a custom programming language, interpreter,ERAN implemented in TypeScript. It includes a lexer, parser, and interpreter to execute programs written in the custom language.

## Project Structure
```
── frontend
│   ├── ast.ts
│   ├── lexer.ts
│   └── parser.ts
├── main.ts
├── readme.md
├── runtime
│   ├── enviroment.ts
│   ├── eval
│   │   ├── expressions.ts
│   │   └── statements.ts
│   ├── interpreter.ts
│   └── value.ts
└── text.txt
```
### Files and Directories

- `frontend/ast.ts`: Defines the Abstract Syntax Tree (AST) structure for the programming language.
- `frontend/lexer.ts`: Implements the lexical analyzer (lexer) that converts source code into tokens.
- `frontend/parser.ts`: Implements the parser that converts tokens into an AST.
- `main.ts`: The main entry point for the interpreter. It can run programs from a file or start a Read-Eval-Print Loop (REPL).
- `runtime/enviroment.ts`: Defines the runtime environment for variable storage and lookup.
- `runtime/eval/expressions.ts`: Contains functions for evaluating expressions.
- `runtime/eval/statements.ts`: Contains functions for evaluating statements.
- `runtime/interpreter.ts`: The main interpreter logic for evaluating the AST.
- `runtime/value.ts`: Defines various types and utility functions for runtime values.
- `text.txt`: A sample program written in the custom programming language.

## Usage

### Running a Program from a File

To run a program from a file, call the `run` function with the file path as an argument. For example, to run the sample program in `text.txt`:

```sh
npm start
```
Starting the REPL
To start the Read-Eval-Print Loop (REPL) for interactive use, call the repl function:
```
npm run repl
```
```
Example Program
Here is an example program written in the custom programming language, located in text.txt:
fn add (x, y) {
    let result = x + y;
    result
}

const num = add(2, 4);
print(num)
```
This program defines a function add that adds two numbers and prints the result of add(2, 4).