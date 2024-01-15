import { BigDecimal, Effect, Option, ReadonlyArray, Secret } from "effect";
import { Markup } from "telegraf";

import { encode } from "../../callback-query/CallbackQuery.js";
import { escapeMarkdown } from "../../message/message-formater.js";
import { RestApiServiceTag } from "../../RestApiService.js";

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
		const points = [
			{
				label: "начало",
				value: new Intl.DateTimeFormat("ru-RU", {
					dateStyle: "short",
					timeStyle: "short",
				}).format(createdEvent.dateStart),
			},
			{
				label: "окончание",
				value: new Intl.DateTimeFormat("ru-RU", {
					dateStyle: "full",
					timeStyle: "short",
				}).format(createdEvent.dateFinish),
			},
			{
				label: "дедлайн регистрации",
				value: new Intl.DateTimeFormat("ru-RU", {
					dateStyle: "short",
					timeStyle: "short",
				}).format(createdEvent.dateDeadline),
			},
			{
				label: "цена проживания за день",
				value: BigDecimal.format(createdEvent.priceDay) + " ₽",
			},
			{
				label: "цена за посещение события",
				value: BigDecimal.format(createdEvent.priceEvent) + " ₽",
			},
		];

		const message = [
			`Создано событие *"${Secret.value(createdEvent.name)}"*:`,
			points
				.map(
					(x) => ` • ${escapeMarkdown(x.label)}: *${escapeMarkdown(x.value)}*`
				)
				.join("\n"),
		].join("\n");

		let subscribers: ReadonlyArray<Option.Option<User>> = [];

		const restApiClient = yield* _(RestApiServiceTag);

		const subscriptionsAnswer = yield* _(
			restApiClient.getPlaceSubscriptions({
				params: {
					idPlace: args.createdEvent.idPlace,
				},
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

		return yield* _(
			[args.initiator, ...ReadonlyArray.getSomes(subscribers)],
			ReadonlyArray.map((x) => x.idTelegramChat),
			(x) => [...new Set(x)],
			ReadonlyArray.map((x) => {
				const encodedCommand = encode({
					action: "create",
					id: args.createdEvent.id,
					type: "Ticket",
				});
				return args.bot.sendMessage(x, message, {
					parse_mode: "MarkdownV2",
					reply_markup: Markup.inlineKeyboard([
						Markup.button.callback("🎟️ Забронировать билет", encodedCommand),
					]).reply_markup,
				});
			}),
			Effect.allWith({
				concurrency: 4,
			})
		);
	});
