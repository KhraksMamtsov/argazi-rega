import { Effect } from "effect";
import { Markup } from "telegraf";

import { SubscriptionCancelledMdComponent } from "./SubscriptionCancelled.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { SubscribePlaceCbButton } from "../../ui/button/SubscribePlace.cb-button.js";

import type { Subscription } from "../../../../domain/subscription/entity/Subscription.js";
import type { User } from "../../../../domain/user/entity/User.js";
import type { TelegrafBot } from "../../telegraf/TelegrafBot.js";

export const SubscriptionCancelledNotificationHandler = (args: {
	readonly bot: TelegrafBot;
	readonly cancelledSubscription: Subscription;
	readonly initiator: User;
	readonly user: User;
}) =>
	Effect.gen(function* (_) {
		const restApiClient = yield* _(RestApiServiceTag);

		const place = yield* _(
			restApiClient.getPlaceById({
				params: {
					idPlace: args.cancelledSubscription.idPlace,
				},
			})
		);

		yield* _(
			args.bot.sendMessage(
				args.user.idTelegramChat,
				yield* _(SubscriptionCancelledMdComponent({ place })),
				Markup.inlineKeyboard([
					yield* _(SubscribePlaceCbButton({ id: place.id })),
				])
			)
		);
	});