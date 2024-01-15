import * as AMQP from "amqplib";
import {
	Layer,
	Stream,
	Effect,
	Secret,
	Config,
	ReadonlyRecord,
	Chunk,
	StreamEmit,
	flow,
	Option,
	Either,
	pipe,
} from "effect";

import { Buffer } from "node:buffer";

import {
	AckError,
	AssertQueueError,
	ConnectError,
	CreateChannelError,
	SendToQueueError,
} from "./MessageBroker.error.js";

import {
	decodeEitherNotification,
	encodeNotification,
	type Notification,
} from "../../domain/notification/Notification.js";
import { NotificationServiceTag } from "../../domain/services/NotificationService.js";

import type { Tail } from "../../libs/Typescript.js";

const RabbitMQService = Effect.gen(function* (_) {
	const config = yield* _(
		Effect.all({
			hostname: Config.secret("RABBITMQ_HOSTNAME"),
			password: Config.secret("RABBITMQ_DEFAULT_PASS"),
			port: Config.secret("RABBITMQ_PORT"),
			username: Config.secret("RABBITMQ_DEFAULT_USER"),
		}),
		Effect.map(ReadonlyRecord.map(Secret.value))
	);

	const connection = yield* _(
		Effect.acquireRelease(
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
		)
	);

	const channel = yield* _(
		Effect.acquireRelease(
			Effect.tryPromise({
				catch: (cause) => new CreateChannelError({ cause }),
				try: () => connection.createChannel(),
			}),
			(channel, _exit) => Effect.promise(() => channel.close())
		)
	);

	yield* _(
		Effect.tryPromise({
			catch: (cause) => new AssertQueueError({ cause }),
			try: () =>
				channel.assertQueue("notifications", {
					durable: true,
				}),
		})
	);

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

	return {
		ack,
		consume,
		sendToQueue,
	};
});

export const live = Effect.gen(function* (_) {
	const rabbitMQService = yield* _(RabbitMQService);
	const queue = "notifications";

	return {
		queue: (notification: Notification) =>
			Effect.gen(function* (_) {
				const encodedNotification = yield* _(
					encodeNotification(notification),
					Effect.orDie
				);
				return yield* _(
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
				ack: (...args: Tail<Parameters<typeof rabbitMQService.ack>>) =>
					rabbitMQService
						.ack(context.message, ...args)
						.pipe(Effect.catchAll(() => Effect.unit)),
				notification: context.notification,
			}))
		),
	} as const;
});

export const NotificationServiceLive = Layer.effect(
	NotificationServiceTag,
	live
);
