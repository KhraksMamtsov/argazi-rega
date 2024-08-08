import { Effect, Layer, Redacted } from "effect";
import { Data } from "effect";
import * as Tg from "telegraf";
import { useNewReplies } from "telegraf/future";

import { TelegrafOptionsTag } from "./TelegrafOptions.js";

import { TelegramCommands } from "../command/TelegramCommands.js";

export enum TelegrafErrorType {
  SEND_MESSAGE = "SEND_MESSAGE::TelegrafErrorType",
}

export class TelegrafCtxSendMessageError extends Data.TaggedError(
  TelegrafErrorType.SEND_MESSAGE
)<{
  readonly args: Array<unknown>;
  readonly error: unknown;
}> {} //

const make = Effect.gen(function* () {
  const config = yield* TelegrafOptionsTag;

  const client = new Tg.Telegraf(Redacted.value(config.token)); //, config.client);

  yield* Effect.promise(() =>
    client.telegram.setMyCommands(TelegramCommands).catch((e) => {
      console.dir(e, { depth: 10 });
      // eslint-disable-next-line functional/no-throw-statements
      throw e;
    })
  );

  const sendMessage = (
    ...args: Parameters<Tg.Telegraf["telegram"]["sendMessage"]>
  ) =>
    Effect.tryPromise({
      catch: (x) =>
        new TelegrafCtxSendMessageError({
          args,
          error: x,
        }),
      try: () =>
        client.telegram.sendMessage(args[0], args[1], {
          parse_mode: "MarkdownV2",
          ...args[2],
        }),
    });

  return { sendMessage, telegrafClient: client.use(useNewReplies()) };
});

export class TelegrafTag extends Effect.Tag("Telegraf")<
  TelegrafTag,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make);

  static Launch = Layer.scopedDiscard(
    Effect.gen(function* () {
      // const launchOptions = yield* pipe(TelegrafOptionsTag.launch);
      const { telegrafClient } = yield* TelegrafTag;

      return yield* Effect.acquireRelease(
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        Effect.async<void>((resume) => {
          return void telegrafClient.launch(() => {
            resume(Effect.void);
          });
        }),
        (_, exit) =>
          Effect.sync(() => {
            telegrafClient.stop(JSON.stringify(exit.toJSON()));
          })
      ).pipe(Effect.tap(Effect.logDebug("Lounched")));
    })
  ).pipe(Layer.provide(TelegrafTag.Live));
}
