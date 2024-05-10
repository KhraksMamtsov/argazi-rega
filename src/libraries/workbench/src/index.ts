import { Schema, type AST } from "@effect/schema";
import type { Simplify } from "effect/Types";

function go(ast: AST.AST): boolean {
  // console.log(ast);
  switch (ast._tag) {
    case "TupleType": {
      return true;
    }
    case "Union": {
      return ast.types.some((x) => go(x));
    }
    case "Refinement": {
      return go(ast.from);
    }
    case "Suspend": {
      return go(ast.f());
    }
    default:
      return false;
  }
}

const test0 = Schema.String;
const test1 = Schema.Array(Schema.String);
const test2 = Schema.Array(Schema.String).pipe(
  Schema.filter((x) => x.length > 2)
);
const test3 = Schema.Union(Schema.String, Schema.Array(Schema.String));
const test4 = Schema.Union(
  Schema.String,
  Schema.suspend(() => Schema.Array(Schema.String))
);
const test5 = Schema.Tuple();
const test6 = Schema.Union(Schema.suspend(() => Schema.Union(Schema.Secret)));

console.log(0, go(test0.ast));
console.log(1, go(test1.ast));
console.log(2, go(test2.ast));
console.log(3, go(test3.ast));
console.log(4, go(test4.ast));
console.log(5, go(test5.ast));
console.log(6, go(test6.ast));

// #region NameSSS
export class NameSSS extends Schema.Class<NameSSS>("NameSSS")({
  asdasd: Schema.NumberFromString,
}) {}

export declare namespace NameSSS {
  export type Context = Schema.Schema.Context<typeof NameSSS>;
  export type EncodedType = typeof NameSSS.Encoded;
  export interface Encoded extends EncodedType {}
  export type Type = Simplify<typeof NameSSS.Type>;
}
// #endregion NameSSS

type asd = typeof NameSSS.Type;
const asd = NameSSS.Encoded;

type asdasd = NameSSS.Encoded;
