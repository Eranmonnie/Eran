export enum TokenType {
  Null,
  Number,
  Identifier,
  Equals,
  Comma,
  Colon,
  Dot,
  OpenParen, //(
  CloseParen, //)
  OpenBrace, //{
  CloseBrace, //}
  OpenBracket, //[
  CloseBracket, //]
  BinaryOperator,
  Semicolon,

  //keywords
  Let,
  Const,
  Fn, //function

  EOF, //end of file
}

const keyword: Record<string, TokenType> = {
  let: TokenType.Let,
  null: TokenType.Null,
  const: TokenType.Const,
  fn: TokenType.Fn,
};

export interface Token {
  value: string;
  type: TokenType;
}

const token = (value = "", type: TokenType): Token => {
  return { value, type };
};

const isAlpha = (src: string): boolean => {
  if (src.toUpperCase() != src.toLowerCase()) {
    return true;
  }
  return false;
};

const isInt = (src: string): boolean => {
  const c = src.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
};

const isSkippable = (str: string): boolean => {
  return str == " " || str == "\n" || str == "\t" || str == "\r";
};

export const tokenize = (input: string): Token[] => {
  const tokens = new Array<Token>();
  const src = input.split("");

  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == "{") {
      tokens.push(token(src.shift(), TokenType.OpenBrace));
    } else if (src[0] == "}") {
      tokens.push(token(src.shift(), TokenType.CloseBrace));
    } else if (src[0] == "[") {
      tokens.push(token(src.shift(), TokenType.OpenBracket));
    } else if (src[0] == "]") {
      tokens.push(token(src.shift(), TokenType.CloseBracket));
    } else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/" ||
      src[0] == "%"
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else if (src[0] == ";") {
      tokens.push(token(src.shift(), TokenType.Semicolon));
    } else if (src[0] == ",") {
      tokens.push(token(src.shift(), TokenType.Comma));
    } else if (src[0] == ":") {
      tokens.push(token(src.shift(), TokenType.Colon));
    } else if (src[0] == ".") {
      tokens.push(token(src.shift(), TokenType.Dot));
    } else {
      //handel multi char tokens

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
        //check for keyword
        const reserved = keyword[id];
        if (typeof reserved == "number") {
          tokens.push(token(id, reserved));
        } else {
          tokens.push(token(id, TokenType.Identifier));
        }
      } else if (isSkippable(src[0])) {
        src.shift(); //skip character
      } else {
        console.log("Error: Unrecognized character found in source: ", src[0]);
        process.exit(1);
      }
    }
  }

  tokens.push(token("EndOfFile", TokenType.EOF));
  return tokens;
};
