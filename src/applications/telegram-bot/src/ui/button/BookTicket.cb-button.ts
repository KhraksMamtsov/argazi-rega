import { Effect } from "effect";
import { Markup } from "telegraf";

import { encode } from "../../callback-query/CallbackQuery.js";

import type { IdEvent } from "../../../../libraries/domain/src/event/entity/IdEvent.js";

export const BookTicketCbButton = (props: { id: IdEvent }) =>
	Effect.succeed(
		Markup.button.callback(
			"🎟️ Забронировать билет",
			encode({
				action: "create",
				id: props.id,
				type: "Ticket",
			})
		)
	);
