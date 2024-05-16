import { Schema, JSONSchema } from "@effect/schema";
import { Schema as S } from "@effect/schema";

const tuple = Schema.Tuple(
  //
  [Schema.Number],
  Schema.String
  // Schema.Boolean
);

try {
  const asd = JSONSchema.make(tuple);
  console.log(asd);
} catch (e) {
  console.log(e);
}

const Person = S.Struct({
  name: S.String,
  role: S.Option(S.Literal("a", "b")),
  role22: S.Option(S.Literal("a", "b")),
  role2: S.Array(S.Literal("a", "b")),
});
