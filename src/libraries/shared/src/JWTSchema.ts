import { ParseResult, Schema } from "@effect/schema";
import { Either, Encoding } from "effect";

export type JWTStruct = Schema.Schema.Type<typeof JWTStructSchema>;

const WithMessageSchema = Schema.struct({
  message: Schema.string,
});
const isWithMessage = Schema.is(WithMessageSchema);

export const JWTStructSchema = Schema.transformOrFail(
  Schema.split(".").pipe(
    Schema.filter(
      (x): x is readonly [string, string, string] => x.length === 3
    ),
    Schema.identifier("JWTLikeSchema")
  ),
  Schema.tuple(Schema.string, Schema.string, Schema.string),
  ([head, payload, sign], _, ast) =>
    Either.all([
      Either.try({
        catch: (e) =>
          new ParseResult.Type(
            ast,
            head,
            isWithMessage(e) ? e.message : undefined
          ),
        try: () => atob(head),
      }),
      Either.try({
        catch: (e) =>
          new ParseResult.Type(
            ast,
            head,
            isWithMessage(e) ? e.message : undefined
          ),
        try: () => atob(payload),
      }),
    ]).pipe(Either.flatMap((x) => ParseResult.succeed([...x, sign] as const))),
  ([header, payload, sign]) =>
    ParseResult.succeed([
      Encoding.encodeBase64(header),
      Encoding.encodeBase64(payload),
      sign,
    ] as const)
).pipe(Schema.identifier("JWTStructSchema"));
