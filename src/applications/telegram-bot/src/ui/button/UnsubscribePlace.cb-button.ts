import { Effect } from "effect";
import { Markup } from "telegraf";

import type { IdSubscription } from "@argazi/domain";

import { encode } from "../../callback-query/CallbackQuery.js";

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
