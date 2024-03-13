import { Effect } from "effect";
import { Markup } from "telegraf";

import { encode } from "../../callback-query/CallbackQuery.js";

import type { Event } from "../../../../domain/event/entity/Event.js";

export const BookTicketCbButton = (props: { event: Event }) =>
	Effect.succeed(
		Markup.button.callback(
			"🎟️ Забронировать билет",
			encode({
				action: "create",
				id: props.event.id,
				type: "Ticket",
			})
		)
	);
