import { Effect, Option, ReadonlyArray } from "effect";
import { Markup } from "telegraf";

import { EventCreatedMdComponent } from "./EventCreated.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { BookTicketCbButton } from "../../ui/button/BookTicket.cb-button.js";

import type { Event } from "../../../../domain/event/entity/Event.js";
import type { User } from "../../../../domain/user/entity/User.js";
import type { TelegrafBot } from "../../telegraf/TelegrafBot.js";

export const EventCreatedNotificationHandler = (args: {
	readonly bot: TelegrafBot;
	readonly createdEvent: Event;
	readonly initiator: User;
}) =>
	Effect.gen(function* (_) {
		const { createdEvent } = args;

		let subscribers: ReadonlyArray<Option.Option<User>> = [];

		const restApiClient = yield* _(RestApiServiceTag);

		const subscriptionsAnswer = yield* _(
			restApiClient.getPlaceSubscriptions({
				params: { idPlace: args.createdEvent.idPlace },
			})
		);

		const place = yield* _(
			restApiClient.getPlaceById({
				params: { idPlace: args.createdEvent.idPlace },
			})
		);

		if (subscriptionsAnswer.status === 200) {
			const idSubscribers = subscriptionsAnswer.content.map((x) => x.idUser);

			subscribers = yield* _(
				restApiClient.getManyUsers({
					body: {
						idsUser: [...idSubscribers, ...idSubscribers],
					},
				})
			);
		}

		const answer = Effect.zip(
			BookTicketCbButton({ id: createdEvent.id }),
			EventCreatedMdComponent({ event: createdEvent, place })
		);

		return yield* _(
			[args.initiator, ...ReadonlyArray.getSomes(subscribers)],
			ReadonlyArray.map((x) => x.idTelegramChat),
			(x) => [...new Set(x)],
			ReadonlyArray.map((x) => {
				return answer.pipe(
					Effect.flatMap((data) =>
						args.bot.sendMessage(x, data[1], Markup.inlineKeyboard([data[0]]))
					)
				);
			}),
			Effect.allWith({
				concurrency: 4,
			})
		);
	});
