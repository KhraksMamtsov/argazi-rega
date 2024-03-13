import { Effect } from "effect";
import { Markup } from "telegraf";

import { encode } from "../../callback-query/CallbackQuery.js";

import type { IdSubscription } from "../../../../domain/subscription/entity/IdSubscription.js";

export const UnsubscribePlaceCbButton = (props: { id: IdSubscription }) =>
	Effect.succeed(
		Markup.button.callback(
			"🔕 Отписаться",
			encode({
				action: "delete",
				id: props.id,
				type: "Subscription",
			})
		)
	);
