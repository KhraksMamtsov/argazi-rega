import { Config, Console, Effect, Redacted, Logger } from "effect";

const getJson = ({ url }: { url: string }) =>
  Effect.tryPromise(() =>
    fetch(url).then((res) => {
      if (!res.ok) {
        console.log("error");
        throw new Error(res.statusText);
      }
      console.log("ok");
      return res.json() as unknown;
    })
  ).pipe(
    Effect.tapErrorCause(Effect.log),
    Effect.retry({ times: 2 }),
    Effect.timeout("41 seconds"),
    Effect.catchAll(Console.error)
  );

const program = Effect.gen(function* () {
  const host = "https://dummyjson.com/auth/products/1?delay=1000";

  const unknownResponse = yield* getJson({
    url: host,
  });

  console.log(unknownResponse);
}).pipe(
  Effect.provide(
    Logger.replace(
      Logger.defaultLogger,
      Logger.prettyLogger({
        colors: true,
      })
    )
  )
);

Effect.runPromise(program);
