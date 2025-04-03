import {
  identity,
  Option,
  pipe,
  Array,
  SchemaAST as AST,
  ParseResult,
  Schema,
} from "effect";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Json {
  export const JsonPrimitive: Schema.Schema<JsonPrimitive> = Schema.Union(
    Schema.Boolean,
    Schema.String,
    Schema.Number,
    Schema.Null
  );

  export const Json: Schema.Schema<Json> = Schema.Union(
    JsonPrimitive,
    Schema.suspend(() => JsonArray),
    Schema.suspend(() => JsonRecord)
  );

  export const JsonRecord: Schema.Schema<JsonRecord> = Schema.Record({
    key: Schema.String,
    value: Schema.suspend(() => Json),
  });

  export const JsonArray: Schema.Schema<JsonArray> = Schema.Array(
    Schema.suspend(() => Json)
  );

  export type JsonPrimitive = boolean | number | string | null;
  export type JsonArray = ReadonlyArray<Json>;
  export type JsonRecord = { readonly [K in string]: Json };
  export type Json = JsonPrimitive | JsonArray | JsonRecord;
}

export const reverse = <R, I, A>(schema: Schema.Schema<A, I, R>) => {
  const reverseAnnotation = pipe(
    schema.ast,
    AST.getIdentifierAnnotation,
    Option.map((x) => `Reversed<${x}>`),
    Option.getOrElse(() => `Reversed<${schema.ast._tag}>`)
  );

  return Schema.transformOrFail(
    Schema.typeSchema(schema),
    Schema.encodedSchema(schema),
    {
      strict: true,
      decode: ParseResult.encode(schema),
      encode: ParseResult.decode(schema),
    }
  ).pipe(Schema.annotations({ identifier: reverseAnnotation }));
};

export const StringFromNumber = reverse(Schema.NumberFromString);

export const OptionNonEmptyArray = <R, I, A>(item: Schema.Schema<A, I, R>) =>
  Schema.transform(
    Schema.Array(item),
    Schema.OptionFromSelf(Schema.NonEmptyArray(Schema.typeSchema(item))),
    {
      strict: true,
      decode: (ss) =>
        Array.match(ss, {
          onEmpty: () => Option.none(),
          onNonEmpty: (x) => Option.some(x),
        }),
      encode: Option.match({ onNone: () => [], onSome: identity }),
    }
  );
