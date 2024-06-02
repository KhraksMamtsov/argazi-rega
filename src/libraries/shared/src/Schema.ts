import { AST, ParseResult, Schema } from "@effect/schema";
import { Effect, flow, identity, Option, pipe, Array } from "effect";

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

  export const JsonRecord: Schema.Schema<JsonRecord> = Schema.Record(
    Schema.String,
    Schema.suspend(() => Json)
  );

  export const JsonArray: Schema.Schema<JsonArray> = Schema.Array(
    Schema.suspend(() => Json)
  );

  export type JsonPrimitive = boolean | number | string | null;
  export type JsonArray = ReadonlyArray<Json>;
  export type JsonRecord = {
    readonly [K in string]: Json;
  };
  export type Json = JsonPrimitive | JsonArray | JsonRecord;
}

export const reverse = <R, I, A>(schema: Schema.Schema<A, I, R>) => {
  const encode = Schema.encode(schema);
  const decode = Schema.decode(schema);

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
      decode: flow(
        encode,
        Effect.mapError((x) => x.error)
      ),
      encode: flow(
        decode,
        Effect.mapError((x) => x.error)
      ),
    }
  ).pipe(Schema.identifier(reverseAnnotation));
};

export const StringFromNumber = reverse(Schema.NumberFromString);

export const OptionNonEmptyArray = <R, I, A>(item: Schema.Schema<A, I, R>) =>
  Schema.transform(
    Schema.Array(item),
    Schema.OptionFromSelf(Schema.NonEmptyArray(Schema.typeSchema(item))),
    {
      decode: (ss) =>
        Array.match(ss, {
          onEmpty: () => Option.none(),
          onNonEmpty: (x) => Option.some(x),
        }),
      encode: Option.match({ onNone: () => [], onSome: identity }),
    }
  );

export const URLFromSelf = Schema.declare((x) => x instanceof URL);

const _URLFromString = Schema.transformOrFail(Schema.String, URLFromSelf, {
  decode: (encoded, _, ast) =>
    ParseResult.try({
      try: () => new URL(encoded),
      catch: (err) =>
        new ParseResult.Type(
          ast,
          encoded,
          err instanceof Error ? err.message : undefined
        ),
    }),
  encode: (type) => ParseResult.succeed(type.toString()),
});

export const URLFromString: Schema.Schema<URL, string> = _URLFromString;
