import { Schema } from "@effect/schema";

const s = Schema.Struct({
  number: Schema.Number,
  string: Schema.String,
  boolean: Schema.Boolean,
  nested: Schema.Struct({
    number: Schema.Number,
    string: Schema.String,
    boolean: Schema.Boolean,
  }),
});

const parse = Schema.decodeUnknownEither(s);

const res = parse({
  number: 1,
  string: "",
  boolean: false,
  nested: { number: 1, string: "", boolean: false },
});

console.log(res);
