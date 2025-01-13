import { EOF } from "dns";
import {
  Stmt,
  Program,
  Expr,
  Property,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  NullLiteral,
  VariableDeclaration,
  FunctionDelaration,
  AssignmentExpr,
  ObjectLiteral,
  CallExpr,
  MemberExpr,
} from "./ast";
import { tokenize, Token, TokenType } from "./lexer";

export class Parser {
  private tokens: Token[] = [];

  private not_eof(): boolean {
    return this.tokens[0].type !== TokenType.EOF;
  }

  private at() {
    return this.tokens[0] as Token;
  }

  private eat() {
    return this.tokens.shift() as Token;
  }

  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.error("Parser Error, \n", err, prev, " - Expecting:", type);
      process.exit(1);
    }
    return prev;
  }

  public produceAst(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);

    const program: Program = {
      kind: "Program",
      body: [],
    };

    //parse until the end of the file
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }
    return program;
  }

  private parse_stmt(): Stmt {
    switch (this.at().type) {
      case TokenType.Let:
        return this.parse_variable_declaration();
      case TokenType.Const:
        return this.parse_variable_declaration();
      case TokenType.Fn:
        return this.parse_fn_declaration();
      default:
        return this.parse_expr();
    }
  }
  parse_fn_declaration(): Stmt {
    this.eat();
    const name = this.expect(
      TokenType.Identifier,
      "Expected function name followin Fn keyword"
    ).value;
    const args = this.parse_args();
    console.log(args);
    const params: string[] = [];
    for (const arg of args) {
      if (arg.kind != "Identifier") {
        console.log(arg);
        throw new Error(
          "Expected  parameters of function to be alpha numeric in name "
        );
      }
      params.push((arg as Identifier).symbol);
    }
    this.expect(
      TokenType.OpenBrace,
      "Expected '{' an the beginning of function body "
    );
    const body: Stmt[] = [];
    while (
      this.at().type != TokenType.EOF &&
      this.at().type != TokenType.CloseBrace
    ) {
      body.push(this.parse_stmt());
    }
    this.expect(
      TokenType.CloseBrace,
      "Expected '}' at the end of function declaration"
    );
    const fn = {
      body,
      name,
      params,
      kind: "FunctionDeclaration",
    } as FunctionDelaration;
    return fn;
  }

  parse_variable_declaration(): Stmt {
    const isConst = this.eat().type == TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier,
      "Expected Identifier name following Let or Const Keyword"
    ).value;
    if (this.at().type == TokenType.Semicolon) {
      this.eat(); //consume the semicolon
      if (isConst) {
        throw new Error("Const variable must be initialized at declaration");
      }
      return {
        kind: "VariableDeclaration",
        constant: isConst,
        identifier,
        value: undefined,
      } as VariableDeclaration;
    }
    this.expect(
      TokenType.Equals,
      "Expected Equals token after variable declaration"
    );
    const declaration = {
      kind: "VariableDeclaration",
      constant: isConst,
      identifier,
      value: this.parse_expr(),
    } as VariableDeclaration;
    this.expect(
      TokenType.Semicolon,
      "Expected Semicolon at the end of statement"
    );
    return declaration;
  }

  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  private parse_assignment_expr(): Expr {
    const left = this.parse_object_expr();
    if (this.at().type == TokenType.Equals) {
      this.eat();
      const value = this.parse_object_expr();
      this.expect(
        TokenType.Semicolon,
        "Expected Semicolon at the end of statement"
      );
      return { value, asignee: left, kind: "AssignmentExpr" } as AssignmentExpr;
    }
    return left;
  }

  private parse_object_expr(): Expr {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parse_additive_expr();
    }

    this.eat();
    const properties = Array<Property>();

    while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
      const key = this.expect(
        TokenType.Identifier,
        "Expected Identifier as key in object literal"
      ).value;

      //handels key shortand
      if (this.at().type == TokenType.Comma) {
        this.eat();
        properties.push({
          key,
          kind: "Property",
        } as Property);
        continue;
      } else if (this.at().type == TokenType.CloseBrace) {
        properties.push({
          key,
          kind: "Property",
        } as Property);
        continue;
      }
      this.expect(
        TokenType.Colon,
        "Expected Colon after key in object literal"
      );

      const value = this.parse_expr();

      properties.push({
        key,
        value,
        kind: "Property",
      } as Property);

      if (this.at().type != TokenType.CloseBrace) {
        this.expect(
          TokenType.Comma,
          "Expected Comma or closing object after property in object literal"
        );
      }
    }

    this.expect(
      TokenType.CloseBrace,
      "Expected closing brace in object literal"
    );
    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
  }

  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }
  private parse_multiplicative_expr(): Expr {
    let left = this.parse_call_member_expr();

    while (
      this.at().value == "/" ||
      this.at().value == "*" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_call_member_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }
  private parse_call_member_expr(): Expr {
    const member = this.parse_member_expr();

    if (this.at().type == TokenType.OpenParen) {
      return this.parse_call_expr(member);
    }

    return member;
  }
  private parse_call_expr(caller: Expr): Expr {
    let call_expr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parse_args(),
    } as CallExpr;
    if (this.at().type == TokenType.OpenParen) {
      call_expr = this.parse_call_expr(call_expr);
    }
    return call_expr;
  }

  private parse_args(): Expr[] {
    this.expect(TokenType.OpenParen, "Expected open parenthesis");
    const args =
      this.at().type == TokenType.CloseParen ? [] : this.parse_argument_list();
    this.expect(TokenType.CloseParen, "missing closing parenthesis");
    return args;
  }

  private parse_argument_list(): Expr[] {
    const args = [this.parse_assignment_expr()];
    while (this.at().type == TokenType.Comma && this.eat()) {
      args.push(this.parse_assignment_expr());
    }
    return args;
  }

  private parse_member_expr(): Expr {
    let object = this.parse_Primary_expr();
    while (
      this.at().type == TokenType.Dot ||
      this.at().type == TokenType.OpenBracket
    ) {
      let operator = this.eat();
      let property: Expr;
      let computed: boolean;

      if (operator.type == TokenType.Dot) {
        computed = false;
        property = this.parse_Primary_expr();
        if (property.kind != "Identifier") {
          throw new Error('cannot use "." operator without an identifier');
        }
      } else {
        computed = true;
        property = this.parse_expr(); //allows chaining
        this.expect(TokenType.CloseBracket, "missing closing bracket");
      }
      object = { kind: "MemberExpr", object, property, computed } as MemberExpr;
    }
    return object;
  }

  //handel order of precedence
  //assignment expression
  //member exp
  //functioncall
  //logical exp
  //comparison expression
  //assignment
  //object
  //addtive expression
  //multipltive expression
  //call
  //member
  //unary expression
  //primary expression

  private parse_Primary_expr(): Expr {
    const tk = this.at().type;
    switch (tk) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;

      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      case TokenType.OpenParen: {
        this.eat();
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token foung in parenthesized experssion"
        );
        return value;
      }

      case TokenType.Null: {
        this.eat();
        return { kind: "NullLiteral", value: "null" } as NullLiteral;
      }

      default:
        console.error("unexpected token found during parsing ", this.at());
        process.exit(1);
    }
  }
}
