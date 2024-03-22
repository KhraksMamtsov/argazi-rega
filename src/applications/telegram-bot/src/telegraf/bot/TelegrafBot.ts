import {
  Context,
  Data,
  Effect,
  Exit,
  FiberSet,
  Option,
  Predicate,
} from "effect";
import * as Tg from "telegraf";
import * as TF from "telegraf/filters";

import { IdTelegramChatSchema } from "@argazi/domain";

import * as TgP from "./TelegramPayload.js";

import { TelegrafTag } from "../Telegraf.js";

import type * as Types from "telegraf/types";

export class TelegrafError extends Data.TaggedError("TelegrafError")<{
  readonly reason: Error;
}> {
  override get message() {
    return this.reason.message;
  }
}

export class TelegrafContext extends Context.Tag("TelegrafContext")<
  TelegrafContext,
  Tg.Context
>() {
  static run = <A>(f: (ctx: Tg.Context) => Promise<A>) =>
    Effect.flatMap(TelegrafContext, (ctx) =>
      Effect.tryPromise({
        catch: (error) => new TelegrafError({ reason: error as Error }),
        try: () => f(ctx),
      })
    );
}

export const on =
  <Ctx extends Types.Update>(filter: Predicate.Refinement<Types.Update, Ctx>) =>
  <T>(
    activate: (context: Tg.NarrowedContext<Tg.Context, Ctx>) => Option.Option<T>
  ) =>
  <NewContext>(mapContext: (context: T) => NewContext) =>
  <A, E, R>(handler: (context: NewContext) => Effect.Effect<A, E, R>) =>
    Effect.gen(function* (_) {
      const { telegrafClient } = yield* _(TelegrafTag);
      const runFork = yield* _(
        FiberSet.makeRuntime<Exclude<R, TelegrafContext>>()
      );

      telegrafClient.on(filter, async (context, next) => {
        const activationResult = activate(context);

        if (Option.isSome(activationResult)) {
          const handle = new Promise<Exit.Exit<A, E>>((resolve) => {
            const fiber = runFork(
              Effect.provideService(
                handler(mapContext(activationResult.value)),
                TelegrafContext,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                context as any
              ).pipe(
                Effect.tapErrorCause(Effect.logFatal),
                Effect.tapError(Effect.logError)
              )
            );

            fiber.addObserver((exit) => {
              resolve(exit);
            });
          });

          const exit = await handle;
          void exit;
        }

        await next();
      });
    });

export const callBackQuery = on(TF.callbackQuery("data"))((context) => {
  const { message } = context.update.callback_query;
  if (message === undefined) {
    return Option.none();
  }
  if (!("text" in message)) {
    return Option.none();
  }
  return Option.some({ context, message });
})(({ context, message }) => {
  return new TgP.CallbackQueryPayload({
    callback_query: context.update.callback_query,
    editMessageText: TgP.editMessageText(context, message.chat.id),
    idTelegramChat: IdTelegramChatSchema(context.update.callback_query.from.id),
    message,
    replyWithMarkdown: TgP.replyWithMarkdown(context),
    sendLocation: (latitude, longitude, extra) =>
      Effect.tryPromise(() => context.sendLocation(latitude, longitude, extra)),
  });
});

export const webAppData = on(TF.message("web_app_data"))(Option.some)(
  (context) =>
    new TgP.WebAppDataPayload({
      idTelegramChat: IdTelegramChatSchema(context.message.chat.id),
      message: context.message,
      replyWithMarkdown: TgP.replyWithMarkdown(context),
    })
);

export const text = on(TF.message("text"))(Option.some)(
  (context) =>
    new TgP.TextPayload({
      editMessageText: TgP.editMessageText(context),
      idTelegramChat: IdTelegramChatSchema(context.message.chat.id),
      message: context.message,
      replyWithMarkdown: TgP.replyWithMarkdown(context),
    })
);

export const command = <A, E, R>(options: {
  readonly handler: (
    context: TgP.CommandPayload<string>
  ) => Effect.Effect<A, E, R>;
}) =>
  Effect.gen(function* (_) {
    const { telegrafClient } = yield* _(TelegrafTag);
    const runFork = yield* _(
      FiberSet.makeRuntime<Exclude<R, TelegrafContext>>()
    );

    telegrafClient.command(/.+/, async (context, next) => {
      const { command } = context;
      const handle = new Promise<Exit.Exit<A, E>>((resolve) => {
        const fiber = runFork(
          Effect.provideService(
            options.handler(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              new TgP.CommandPayload({
                command,
                editMessageText: TgP.editMessageText(context),
                idTelegramChat: IdTelegramChatSchema(context.message.chat.id),
                message: context.message,
                replyWithMarkdown: TgP.replyWithMarkdown(context),
              }) as any
            ),
            TelegrafContext,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            context
          ).pipe(
            Effect.tapErrorCause(Effect.logFatal),
            Effect.tapError(Effect.logError),
            Effect.tap(Effect.log)
          )
        );

        fiber.addObserver((exit) => {
          resolve(exit);
        });
      });

      const exit = await handle;
      void exit;

      await next();
    });
  });
