import { Effect } from "effect";
import { Markup } from "telegraf";

import type { IdEvent } from "@argazi/domain";

import { encode } from "../../callback-query/CallbackQuery.js";

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
