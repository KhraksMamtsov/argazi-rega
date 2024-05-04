import { ParseResult, Schema } from "@effect/schema";
import { Either, Encoding } from "effect";

export type JWTStruct = Schema.Schema.Type<typeof JWTStruct>;

const WithMessage = Schema.Struct({
  message: Schema.String,
});
const isWithMessage = Schema.is(WithMessage);

export const JWTStruct = Schema.transformOrFail(
  Schema.split(".").pipe(
    Schema.filter(
      (x): x is readonly [string, string, string] => x.length === 3
    ),
    Schema.identifier("JWTLike")
  ),
  Schema.Tuple(Schema.String, Schema.String, Schema.String),
  {
    decode: ([head, payload, sign], _, ast) =>
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
      ]).pipe(
        Either.flatMap((x) => ParseResult.succeed([...x, sign] as const))
      ),
    encode: ([header, payload, sign]) =>
      ParseResult.succeed([
        Encoding.encodeBase64(header),
        Encoding.encodeBase64(payload),
        sign,
      ] as const),
  }
).pipe(Schema.identifier("JWTStruct"));
