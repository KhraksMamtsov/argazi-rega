import { Effect } from "effect";
import { Markup } from "telegraf";

import { SubscriptionCreatedMdComponent } from "./SubscriptionCreated.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { UnsubscribePlaceCbButton } from "../../ui/button/UnsubscribePlace.cb-button.js";

import type { Subscription } from "../../../../libraries/domain/src/subscription/entity/Subscription.js";
import type { User } from "../../../../libraries/domain/src/user/entity/User.js";

export const SubscriptionCreatedNotificationHandler = (args: {
	readonly createdSubscription: Subscription;
	readonly initiator: User;
	readonly user: User;
}) =>
	Effect.gen(function* (_) {
		const telegraf = yield* _(TelegrafTag);

		const place = yield* _(
			RestApiServiceTag.getPlaceById({
				path: { idPlace: args.createdSubscription.idPlace },
			})
		);

		yield* _(
			telegraf.sendMessage(
				args.user.idTelegramChat,
				yield* _(
					SubscriptionCreatedMdComponent({
						place,
					})
				),
				Markup.inlineKeyboard([
					yield* _(
						UnsubscribePlaceCbButton({
							id: args.createdSubscription.id,
						})
					),
				])
			)
		);
	});
