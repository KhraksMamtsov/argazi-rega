import { Effect } from "effect";
import { Markup } from "telegraf";

import { SubscriptionCreatedMdComponent } from "./SubscriptionCreated.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { UnsubscribePlaceCbButton } from "../../ui/button/UnsubscribePlace.cb-button.js";

import type { Subscription } from "../../../../domain/subscription/entity/Subscription.js";
import type { User } from "../../../../domain/user/entity/User.js";
import type { TelegrafBot } from "../../telegraf/TelegrafBot.js";

export const SubscriptionCreatedNotificationHandler = (args: {
	readonly bot: TelegrafBot;
	readonly createdSubscription: Subscription;
	readonly initiator: User;
	readonly user: User;
}) =>
	Effect.gen(function* (_) {
		const place = yield* _(
			RestApiServiceTag.getPlaceById({
				params: { idPlace: args.createdSubscription.idPlace },
			})
		);

		yield* _(
			args.bot.sendMessage(
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
