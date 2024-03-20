import { Effect } from "effect";
import { Markup } from "telegraf";

import { SubscriptionCancelledMdComponent } from "./SubscriptionCancelled.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { SubscribePlaceCbButton } from "../../ui/button/SubscribePlace.cb-button.js";

import type { Subscription } from "../../../../libraries/domain/src/subscription/entity/Subscription.js";
import type { User } from "../../../../libraries/domain/src/user/entity/User.js";

export const SubscriptionCancelledNotificationHandler = (args: {
	readonly cancelledSubscription: Subscription;
	readonly initiator: User;
	readonly user: User;
}) =>
	Effect.gen(function* (_) {
		const telegraf = yield* _(TelegrafTag);
		const restApiClient = yield* _(RestApiServiceTag);

		const place = yield* _(
			restApiClient.getPlaceById({
				path: {
					idPlace: args.cancelledSubscription.idPlace,
				},
			})
		);

		yield* _(
			telegraf.sendMessage(
				args.user.idTelegramChat,
				yield* _(SubscriptionCancelledMdComponent({ place })),
				Markup.inlineKeyboard([
					yield* _(SubscribePlaceCbButton({ id: place.id })),
				])
			)
		);
	});
