import { Effect } from "effect";
import { Markup } from "telegraf";

import { encode } from "../callback-query/CallbackQuery.js";
import { RestApiServiceTag } from "../RestApiService.js";
import { CommandPayload } from "../telegraf/TelegrafBot.js";
import { PlaceMdComponent } from "../ui/Place.md-component.js";

export const PlacesCommandHandler = (args: {
	readonly command: CommandPayload<"places">;
}) =>
	Effect.gen(function* (_) {
		const restApiService = yield* _(RestApiServiceTag);
		const restApiUserClient = yield* _(
			restApiService.__new.getUserApiClientFor(args.command.idTelegramChat)
		);

		const places = yield* _(restApiUserClient.getPlaces({}));
		const userSubscriptions = yield* _(
			restApiUserClient.getMySubscriptions({})
		);

		const replies = places.map((place) => {
			const placeSubscription = userSubscriptions.find(
				(x) => x.idPlace === place.id
			);

			const buttons = [
				Markup.button.callback(
					"Подробнее",
					encode({
						action: "get",
						id: place.id,
						type: "Place",
					})
				),
			];
			if (placeSubscription) {
				buttons.push(
					Markup.button.callback(
						"🔕 Отписаться",
						encode({
							action: "delete",
							id: placeSubscription.id,
							type: "Subscription",
						})
					)
				);
			} else {
				buttons.push(
					Markup.button.callback(
						"🔔 Подписаться",
						encode({
							action: "create",
							id: place.id,
							type: "Subscription",
						})
					)
				);
			}

			return PlaceMdComponent({ place }).pipe(
				Effect.flatMap((x) =>
					args.command.replyWithMarkdown(x, {
						...Markup.inlineKeyboard(buttons),
						parse_mode: "MarkdownV2",
					})
				)
			);
		});

		return yield* _(
			Effect.all(replies, { concurrency: "unbounded", mode: "either" })
		);
	});
