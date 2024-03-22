import { Effect, Sink, Stream, Layer } from "effect";

import { NotificationServiceTag } from "@argazi/domain";

import { NotificationsHandler } from "./NotificationsHandler.js";

import { TelegrafTag } from "../telegraf/Telegraf.js";

export const NotificationsHandlerLive = Layer.scopedDiscard(
	Effect.gen(function* (_) {
		const notificationsStream = yield* _(NotificationServiceTag.stream$);

		yield* _(
			notificationsStream,
			Stream.run(
				Sink.forEach((context) =>
					NotificationsHandler({
						notificationMessage: context,
					})
				)
			),
			Effect.fork
		);
	})
).pipe(Layer.provide(TelegrafTag.Live));
