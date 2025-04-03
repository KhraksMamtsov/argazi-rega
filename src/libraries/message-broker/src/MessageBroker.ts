import * as AMQP from "amqplib";
import {
  Layer,
  Stream,
  Effect,
  Redacted,
  Config,
  Record,
  Chunk,
  StreamEmit,
  flow,
  Option,
  Either,
  pipe,
} from "effect";

import { Buffer } from "node:buffer";

import {
  decodeEitherNotification,
  encodeNotification,
  type Notification,
  NotificationServiceTag,
} from "@argazi/domain";
import type { _TS } from "@argazi/shared";

import {
  AckError,
  AssertQueueError,
  ConnectError,
  CreateChannelError,
  SendToQueueError,
} from "./MessageBroker.error.js";

const RabbitMQService = Effect.gen(function* () {
  const config = yield* pipe(
    Effect.all({
      hostname: Config.redacted("RABBITMQ_HOSTNAME"),
      password: Config.redacted("RABBITMQ_DEFAULT_PASS"),
      port: Config.redacted("RABBITMQ_PORT"),
      username: Config.redacted("RABBITMQ_DEFAULT_USER"),
    }),
    Effect.map(Record.map(Redacted.value))
  );

  const connect = Effect.acquireRelease(
    Effect.tryPromise({
      catch: (cause) => {
        return new ConnectError({ cause, config });
      },
      try: () =>
        AMQP.connect({
          hostname: config.hostname,
          password: config.password,
          port: Number(config.port),
          username: config.username,
        }),
    }),
    (connection, _exit) => Effect.promise(() => connection.close())
  );

  const connection = yield* connect;

  const channel = yield* Effect.acquireRelease(
    Effect.tryPromise({
      catch: (cause) => new CreateChannelError({ cause }),
      try: () => connection.createChannel(),
    }),
    (channel, _exit) => Effect.promise(() => channel.close())
  );

  yield* Effect.tryPromise({
    catch: (cause) => new AssertQueueError({ cause }),
    try: () =>
      channel.assertQueue("notifications", {
        durable: true,
      }),
  });

  const sendToQueue = (...args: Parameters<typeof channel.sendToQueue>) =>
    Effect.try({
      catch: (cause) => new SendToQueueError({ cause }),
      try: () => channel.sendToQueue(...args),
    });

  const ack = (...args: Parameters<typeof channel.ack>) =>
    Effect.try({
      catch: (cause) => new AckError({ cause }),
      try: () => {
        channel.ack(...args);
      },
    });

  const consume = (
    queue: Parameters<typeof channel.consume>[0],
    options?: Parameters<typeof channel.consume>[2]
  ) =>
    Stream.async(
      (emit: StreamEmit.Emit<never, never, AMQP.Message | null, void>) => {
        void channel.consume(
          queue,
          (x) => void pipe(x, Chunk.of, Effect.succeed, emit),
          options
        );
      }
    );

  return { connect, ack, consume, sendToQueue };
});

export const live = Effect.gen(function* () {
  const rabbitMQService = yield* RabbitMQService;
  const queue = "notifications";

  return {
    healthCheck: rabbitMQService.connect.pipe(
      Effect.zipRight(Effect.void),
      Effect.scoped
    ),
    queue: (notification: Notification) =>
      Effect.gen(function* () {
        const encodedNotification = yield* pipe(
          encodeNotification(notification),
          Effect.orDie
        );
        return yield* pipe(
          rabbitMQService.sendToQueue(
            queue,
            Buffer.from(encodedNotification),
            {}
          ),
          Effect.orDie
        );
      }),
    stream$: rabbitMQService.consume(queue, {}).pipe(
      Stream.filterMap(
        flow(
          Option.fromNullable,
          Option.flatMap((message) =>
            decodeEitherNotification(message.content.toString()).pipe(
              Either.getRight,
              Option.map((notification) => ({
                message,
                notification,
              }))
            )
          )
        )
      ),
      Stream.map((context) => ({
        _tag: "NotificationMessage" as const,
        ack: (...args: _TS.Tail<Parameters<typeof rabbitMQService.ack>>) =>
          rabbitMQService
            .ack(context.message, ...args)
            .pipe(Effect.catchAll(() => Effect.void)),
        notification: context.notification,
      }))
    ),
  } as const;
});

export const NotificationServiceLive = Layer.scoped(
  NotificationServiceTag,
  live
);
