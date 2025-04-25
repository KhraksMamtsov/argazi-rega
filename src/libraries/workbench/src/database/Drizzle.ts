import { drizzle } from "drizzle-orm/better-sqlite3";
import { Config, Data, Effect, Schema } from "effect";
import * as ParseError from "effect/ParseResult";

export class DrizzleError extends Data.TaggedError("DrizzleError")<{
  cause: Error;
}> {}

export class Drizzle extends Effect.Service<Drizzle>()("Drizzle", {
  scoped: Effect.acquireRelease(
    Effect.gen(function* () {
      const dbFilename = yield* Config.nonEmptyString("DB_FILE_NAME");

      return yield* Effect.try({
        try: () => drizzle(dbFilename),
        catch: (cause) => new DrizzleError({ cause: cause as Error }),
      });
    }),
    (x) => Effect.sync(() => x.$client.close())
  ),
}) {}

export class DrizzleClientError extends Data.TaggedError("DrizzleClientError")<{
  cause: unknown;
}> {}
export class DrizzleClientDecodeError extends Data.TaggedError(
  "DrizzleClientDecodeError"
)<{
  parseError: ParseError.ParseError;
}> {}
export class DrizzleClientEncodeError extends Data.TaggedError(
  "DrizzleClientDecodeError"
)<{
  parseError: ParseError.ParseError;
}> {}

export class DrizzleClient extends Effect.Service<DrizzleClient>()(
  "DrizzleClient",
  {
    dependencies: [Drizzle.Default],
    effect: Effect.gen(function* () {
      const _drizzle = yield* Drizzle;

      return {
        queryAndDecode: Effect.fn("DrizzleClient.queryAndDecode")(function* <
          A,
          I,
          R,
        >(
          schema: Schema.Schema<A, I, R>,
          cb: (drizzle: typeof _drizzle) => Promise<I>
        ) {
          const dbResult = yield* Effect.tryPromise({
            try: async () => cb(_drizzle),
            catch: (cause) => new DrizzleClientError({ cause }),
          });

          const decodedResult = yield* Schema.decode(schema)(dbResult).pipe(
            Effect.mapError(
              (parseError) =>
                new DrizzleClientDecodeError({
                  parseError,
                })
            )
          );

          return decodedResult;
        }),

        encodeAndQuery:
          <A, I, R, D>(
            schema: Schema.Schema<A, I, R>,
            cb: (encodedData: I, drizzle: typeof _drizzle) => Promise<D>
          ) =>
          (data: A) =>
            Effect.gen(function* () {
              const encodedData = yield* Schema.encode(schema)(data).pipe(
                Effect.mapError(
                  (parseError) =>
                    new DrizzleClientEncodeError({
                      parseError,
                    })
                )
              );

              const dbResult = yield* Effect.tryPromise({
                try: async () => cb(encodedData, _drizzle),
                catch: (cause) => new DrizzleClientError({ cause }),
              });

              return dbResult;
            }),
      };
    }),
  }
) {}
