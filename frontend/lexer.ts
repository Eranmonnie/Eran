/**
 * **lexer.ts**
 * 
 * This file contains the implementation of a lexical analyzer (lexer) for a programming language.
 * The lexer is responsible for converting a source string into a stream of tokens that can be used
 * by a parser to generate an Abstract Syntax Tree (AST).
 */

/**
 * **TokenType**
 * 
 * Enum representing the different types of tokens recognized by the lexer.
 */
export enum TokenType {
  Null,            // Represents a null literal
  Number,          // Represents a numeric literal
  Identifier,      // Represents an identifier (e.g., variable names)
  Equals,          // '='
  Comma,           // ','
  Colon,           // ':'
  Dot,             // '.'
  OpenParen,       // '('
  CloseParen,      // ')'
  OpenBrace,       // '{'
  CloseBrace,      // '}'
  OpenBracket,     // '['
  CloseBracket,    // ']'
  BinaryOperator,  // Binary operators like '+', '-', '*', '/'
  Semicolon,       // ';'

  // Keywords
  Let,             // 'let'
  Const,           // 'const'
  Fn,              // 'fn' (function)

  EOF,             // End of file
}

/**
 * **keyword**
 * 
 * A record mapping reserved keywords to their corresponding `TokenType`.
 */
const keyword: Record<string, TokenType> = {
  let: TokenType.Let,
  null: TokenType.Null,
  const: TokenType.Const,
  fn: TokenType.Fn,
};

/**
 * **Token**
 * 
 * Interface representing a token produced by the lexer.
 */
export interface Token {
  value: string;    // The textual representation of the token
  type: TokenType;  // The type of the token
}

/**
 * **token**
 * 
 * Helper function to create a `Token` object.
 */
const token = (value = "", type: TokenType): Token => {
  return { value, type };
};

/**
 * **isAlpha**
 * 
 * Checks if a character is an alphabetic character.
 */
const isAlpha = (src: string): boolean => {
  return src.toUpperCase() !== src.toLowerCase();
};

/**
 * **isInt**
 * 
 * Checks if a character is a numeric digit.
 */
const isInt = (src: string): boolean => {
  const c = src.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
};

/**
 * **isSkippable**
 * 
 * Checks if a character is a whitespace character that can be skipped.
 */
const isSkippable = (str: string): boolean => {
  return str === " " || str === "\n" || str === "\t" || str === "\r";
};

/**
 * **tokenize**
 * 
 * Converts a source string into an array of tokens.
 * 
 * @param input - The source string to tokenize
 * @returns An array of `Token` objects
 */
export const tokenize = (input: string): Token[] => {
  const tokens = new Array<Token>();
  const src = input.split("");

  while (src.length > 0) {
    if (src[0] === "(") {
      tokens.push(token(src.shift()!, TokenType.OpenParen));
    } else if (src[0] === ")") {
      tokens.push(token(src.shift()!, TokenType.CloseParen));
    } else if (src[0] === "{") {
      tokens.push(token(src.shift()!, TokenType.OpenBrace));
    } else if (src[0] === "}") {
      tokens.push(token(src.shift()!, TokenType.CloseBrace));
    } else if (src[0] === "[") {
      tokens.push(token(src.shift()!, TokenType.OpenBracket));
    } else if (src[0] === "]") {
      tokens.push(token(src.shift()!, TokenType.CloseBracket));
    } else if (
      src[0] === "+" ||
      src[0] === "-" ||
      src[0] === "*" ||
      src[0] === "/" ||
      src[0] === "%"
    ) {
      tokens.push(token(src.shift()!, TokenType.BinaryOperator));
    } else if (src[0] === "=") {
      tokens.push(token(src.shift()!, TokenType.Equals));
    } else if (src[0] === ";") {
      tokens.push(token(src.shift()!, TokenType.Semicolon));
    } else if (src[0] === ",") {
      tokens.push(token(src.shift()!, TokenType.Comma));
    } else if (src[0] === ":") {
      tokens.push(token(src.shift()!, TokenType.Colon));
    } else if (src[0] === ".") {
      tokens.push(token(src.shift()!, TokenType.Dot));
    } else {
      // Handle multi-character tokens
      if (isInt(src[0])) {
        let num = "";
        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }
        tokens.push(token(num, TokenType.Number));
      } else if (isAlpha(src[0])) {
        let id = "";
        while (src.length > 0 && isAlpha(src[0])) {
          id += src.shift();
        }
        // Check for reserved keywords
        const reserved = keyword[id];
        if (typeof reserved === "number") {
          tokens.push(token(id, reserved));
        } else {
          tokens.push(token(id, TokenType.Identifier));
        }
      } else if (isSkippable(src[0])) {
        src.shift(); // Skip character
      } else {
        console.log("Error: Unrecognized character found in source: ", src[0]);
        process.exit(1);
      }
    }
  }

  tokens.push(token("EndOfFile", TokenType.EOF));
  return tokens;
};
