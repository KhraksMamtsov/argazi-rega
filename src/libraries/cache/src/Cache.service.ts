import {
  Chunk,
  Context,
  Config,
  Data,
  Effect,
  Layer,
  Scope,
  Option,
  Secret,
  Stream,
  flow,
} from "effect";
import { createClient, type RedisClientOptions } from "redis";

import { _TS } from "@argazi/shared";

export interface RedisClient extends ReturnType<typeof createClient> {}

export const create = (
  options?: RedisClientOptions
): Effect.Effect<RedisClient> => Effect.sync(() => createClient(options));

export class CacheConnectError extends Data.TaggedError("CacheConnectError")<{
  readonly cause: unknown;
}> {}
export class CacheError extends Data.TaggedError("CacheError")<{
  readonly cause: unknown;
}> {}
export class CacheSetError extends Data.TaggedError("CacheSetError")<{
  readonly cause: unknown;
}> {}
export class CacheHDelError extends Data.TaggedError("CacheHDelError")<{
  readonly cause: unknown;
}> {}
export class CacheHSetError extends Data.TaggedError("CacheHSetError")<{
  readonly cause: unknown;
}> {}

export interface RedisOptions extends RedisClientOptions {}
export type GetParameters = Parameters<RedisClient["get"]>;
export type HGetParameters = Parameters<RedisClient["hGet"]>;
export type HDelParameters = Parameters<RedisClient["hDel"]>;
export type HSetParameters = Parameters<RedisClient["hSet"]>;
export type SetParameters = Parameters<RedisClient["set"]>;

const makeClient = (client: RedisClient) => {
  return {
    get: (...args: GetParameters) =>
      Effect.tryPromise({
        catch: (cause) => new CacheSetError({ cause }),
        try: () => client.get(...args),
      })
        .pipe(Effect.map(Option.fromNullable))
        .pipe(Effect.withLogSpan("CacheService.get")),
    hDel: (...args: HDelParameters) =>
      Effect.tryPromise({
        catch: (cause) => new CacheHDelError({ cause }),
        try: () => client.hDel(...args),
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        }),
        Effect.withLogSpan("CacheService.hDel")
        // Effect.annotateLogs({ credentials, idTelegramChat })
      ),
    hGet: (...args: HGetParameters) =>
      Effect.tryPromise({
        catch: (cause) => new CacheSetError({ cause }),
        try: () => client.hGet(...args),
      })
        .pipe(
          Effect.map(flow(Option.fromNullable, Option.map(Secret.fromString)))
        )
        .pipe(
          Effect.tapBoth({
            onFailure: Effect.logError,
            onSuccess: Effect.logInfo,
          }),
          Effect.withLogSpan("CacheService.hGet")
          // Effect.annotateLogs({ credentials, idTelegramChat })
        ),
    hSet: (...args: HSetParameters) =>
      Effect.tryPromise({
        catch: (cause) => new CacheHSetError({ cause }),
        try: () => client.hSet(...args),
      }).pipe(
        Effect.withLogSpan("CacheService.hSet")
        // Effect.annotateLogs({ credentials, idTelegramChat })
      ),
    set: (...args: SetParameters) =>
      Effect.tryPromise({
        catch: (cause) => new CacheSetError({ cause }),
        try: () => client.set(...args),
      }).pipe(
        Effect.withLogSpan("CacheService.set")
        // Effect.annotateLogs({ credentials, idTelegramChat })
      ),
  } as const;
};

export const initialize = (
  options?: RedisClientOptions
): Effect.Effect<
  {
    readonly client: _TS.Simplify<ReturnType<typeof makeClient>>;
    readonly error$: Stream.Stream<CacheError>;
  },
  CacheConnectError,
  Scope.Scope
> => {
  const client = createClient(options);

  const error$ = Stream.async<CacheError>((emit) => {
    console.log("client.on(error)");

    client.on("error", (cause: unknown) => {
      void emit(Effect.succeed(Chunk.of(new CacheError({ cause }))));
    });
  });

  return Effect.acquireRelease(
    Effect.tryPromise({
      catch: (cause) => new CacheConnectError({ cause }),
      try: () => client.connect(),
    }),
    (x) => Effect.promise(() => x.disconnect())
  ).pipe(Effect.map((client) => ({ client: makeClient(client), error$ })));
};

export interface CacheService extends ReturnType<typeof makeClient> {}

export class CacheServiceTag extends Context.Tag("CacheService")<
  CacheServiceTag,
  CacheService
>() {
  public static Live = (options?: RedisOptions) =>
    Layer.effect(
      this,
      Effect.gen(function* (_) {
        const password = yield* _(Config.secret("REDIS_PASSWORD"));
        const port = yield* _(Config.secret("REDIS_PORT"));
        const host = yield* _(Config.secret("REDIS_HOST"));

        const redisURL = new URL(
          `redis://:${Secret.value(password)}@${Secret.value(host)}:${Secret.value(port)}`
        );

        const initResult = yield* _(
          initialize({
            url: redisURL.toString(),
            ...options,
          })
        );

        return initResult.client;
      })
    );
}
