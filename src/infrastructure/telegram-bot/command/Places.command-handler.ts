import { Effect } from "effect";
import { Markup } from "telegraf";

import { RestApiServiceTag } from "../RestApiService.js";
import { CommandPayload } from "../telegraf/TelegrafBot.js";
import { AboutPlaceCbButton } from "../ui/button/AboutPlace.cb-button.js";
import { SubscribePlaceCbButton } from "../ui/button/SubscribePlace.cb-button.js";
import { UnsubscribePlaceCbButton } from "../ui/button/UnsubscribePlace.cb-button.js";
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

			const buttons = [AboutPlaceCbButton({ id: place.id })];

			if (placeSubscription) {
				buttons.push(UnsubscribePlaceCbButton({ id: placeSubscription.id }));
			} else {
				buttons.push(SubscribePlaceCbButton({ id: place.id }));
			}

			return Effect.zip(PlaceMdComponent({ place }), Effect.all(buttons)).pipe(
				Effect.flatMap((data) =>
					args.command.replyWithMarkdown(data[0], {
						...Markup.inlineKeyboard(data[1]),
					})
				)
			);
		});

		return yield* _(
			Effect.all(replies, { concurrency: "unbounded", mode: "either" })
		);
	});
