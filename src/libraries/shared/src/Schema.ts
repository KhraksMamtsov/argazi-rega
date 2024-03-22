import { AST, Schema } from "@effect/schema";
import { Effect, flow, identity, Option, pipe, ReadonlyArray } from "effect";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Json {
  export const JsonPrimitive: Schema.Schema<JsonPrimitive> = Schema.union(
    Schema.boolean,
    Schema.string,
    Schema.number,
    Schema.null
  );

  export const Json: Schema.Schema<Json> = Schema.union(
    JsonPrimitive,
    Schema.suspend(() => JsonArray),
    Schema.suspend(() => JsonRecord)
  );

  export const JsonRecord: Schema.Schema<JsonRecord> = Schema.record(
    Schema.string,
    Schema.suspend(() => Json)
  );

  export const JsonArray: Schema.Schema<JsonArray> = Schema.array(
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
    flow(
      encode,
      Effect.mapError((x) => x.error)
    ),
    flow(
      decode,
      Effect.mapError((x) => x.error)
    )
  ).pipe(Schema.identifier(reverseAnnotation));
};

export const StringFromNumber = reverse(Schema.NumberFromString);

export const OptionNonEmptyArray = <R, I, A>(item: Schema.Schema<A, I, R>) =>
  Schema.transform(
    Schema.array(item),
    Schema.optionFromSelf(Schema.nonEmptyArray(Schema.typeSchema(item))),
    (ss) =>
      ReadonlyArray.match(ss, {
        onEmpty: () => Option.none(),
        onNonEmpty: (x) => Option.some(x),
      }),
    Option.match({ onNone: () => [], onSome: identity })
  );
