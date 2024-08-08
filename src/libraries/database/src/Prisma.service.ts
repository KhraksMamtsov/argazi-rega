import { Schema, ParseResult } from "@effect/schema";
import { PrismaClient } from "@prisma/client";
import { Config, Data, Effect, Layer, pipe, Redacted } from "effect";

export class PrismaDecodeError extends Data.TaggedError("PrismaDecodeError")<{
  readonly cause: ParseResult.ParseError;
}> {}
export class PrismaQueryError extends Data.TaggedError("PrismaQueryError")<{
  readonly cause: unknown;
}> {}

const makeLive = Effect.gen(function* () {
  const credentials = yield* Config.all({
    datasourceUrl: Config.redacted("PRISMA_DB_URL"),
  });

  const prismaClient = yield* Effect.sync(
    () =>
      new PrismaClient({
        datasourceUrl: Redacted.value(credentials.datasourceUrl),
      })
  );

  const _query = <T>(
    query: (prisma: Omit<typeof prismaClient, `$${string}`>) => Promise<T>
  ) =>
    Effect.tryPromise({
      catch: (cause) => new PrismaQueryError({ cause }),
      try: () => query(prismaClient),
    }).pipe(
      Effect.tapError((x) => {
        console.dir(x.cause, { depth: 100 });
        return Effect.logError(x.cause);
      })
    );

  const executeRaw = <T>(
    query: (prisma: (typeof prismaClient)["$executeRaw"]) => Promise<T>
  ) =>
    Effect.tryPromise({
      catch: (cause) => new PrismaQueryError({ cause }),
      try: () => query(prismaClient.$executeRaw.bind(prismaClient)),
    }).pipe(
      Effect.tapError((x) => {
        console.dir(x.cause, { depth: 100 });
        return Effect.logError(x.cause);
      })
    );

  const queryRaw = (...args: Parameters<(typeof prismaClient)["$queryRaw"]>) =>
    Effect.tryPromise({
      catch: (cause) => new PrismaQueryError({ cause }),
      try: () => prismaClient.$queryRaw.apply(prismaClient, args),
    }).pipe(
      Effect.tapError((x) => {
        console.dir(x.cause, { depth: 100 });
        return Effect.logError(x.cause);
      })
    );

  const withService = <T>(query: (prisma: typeof prismaClient) => Promise<T>) =>
    Effect.tryPromise({
      catch: (cause) => new PrismaQueryError({ cause }),
      try: () => query(prismaClient),
    }).pipe(
      Effect.tapError((x) => {
        console.dir(x.cause, { depth: 100 });
        return Effect.logError(x.cause);
      })
    );

  const queryDecode = <A, I, R>(
    schema: Schema.Schema<R, I, A>,
    query: (
      prisma: Omit<typeof prismaClient, `$${string}` | symbol>
    ) => Promise<NoInfer<I>>
  ) => {
    const decode = Schema.decode(schema);

    return Effect.gen(function* () {
      const queryResult = yield* _query(query);

      return yield* pipe(
        queryResult,
        decode,
        Effect.mapError((cause) => new PrismaDecodeError({ cause }))
      );
    });
  };

  const update = <
    A,
    I,
    R,
    E extends Exclude<keyof typeof prismaClient, `$${string}` | symbol>,
  >(
    entity: E,
    schema: Schema.Schema<R, I, A>,
    query: Parameters<(typeof prismaClient)[E]["update"]>[0]
  ) => {
    const decodeUnknown = Schema.decodeUnknown(schema);

    // eslint-disable-next-line
    return _query((x) => (x[entity] as any).update(query)).pipe(
      Effect.flatMap((x) =>
        pipe(
          x,
          decodeUnknown,
          Effect.mapError((cause) => new PrismaDecodeError({ cause }))
        )
      )
    );
  };

  return {
    queryRaw,
    executeRaw,
    query: _query,
    queryDecode,
    update,
    withService,
  };
});

export interface PrismaServiceId {
  readonly _: unique symbol;
}

export interface PrismaService extends Effect.Effect.Success<typeof makeLive> {}

export class PrismaServiceTag extends Effect.Tag(
  "@argazi/infrastructure/PrismaService"
)<PrismaServiceTag, PrismaService>() {
  public static readonly Live = Layer.effect(this, makeLive);
}
