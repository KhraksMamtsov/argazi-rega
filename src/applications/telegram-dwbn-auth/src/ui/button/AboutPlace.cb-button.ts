import { Effect } from "effect";
import { Markup } from "telegraf";

import { encode } from "../../callback-query/CallbackQuery.js";

import type { IdPlace } from "../../../../libraries/domain/src/place/entity/IdPlace.js";

export const AboutPlaceCbButton = (props: { id: IdPlace }) =>
	Effect.succeed(
		Markup.button.callback(
			"🏡 О Месте",
			encode({
				action: "get",
				id: props.id,
				type: "Place",
			})
		)
	);
