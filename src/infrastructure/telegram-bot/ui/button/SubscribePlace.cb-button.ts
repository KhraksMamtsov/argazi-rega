import { Effect } from "effect";
import { Markup } from "telegraf";

import { encode } from "../../callback-query/CallbackQuery.js";

import type { IdPlace } from "../../../../domain/place/entity/IdPlace.js";

export const SubscribePlaceCbButton = (props: { id: IdPlace }) =>
	Effect.succeed(
		Markup.button.callback(
			"🔔 Подписаться",
			encode({
				action: "create",
				id: props.id,
				type: "Subscription",
			})
		)
	);
