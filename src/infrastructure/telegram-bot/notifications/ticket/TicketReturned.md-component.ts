import { Effect } from "effect";

import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { EventMdComponent } from "../../ui/Event.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { PlaceMdComponent } from "../../ui/Place.md-component.js";
import { TicketMdComponent } from "../../ui/Ticket.md-component.js";

import type { Event } from "../../../../domain/event/entity/Event.js";
import type { Place } from "../../../../domain/place/entity/Place.js";
import type { Ticket } from "../../../../domain/ticket/entity/Ticket.js";

export const TicketReturnedMdComponent = (props: {
	event: Event;
	place: Place;
	ticket: Ticket;
}) =>
	Effect.gen(function* (_) {
		const { place, event, ticket } = props;

		return yield* _(
			MD.document(
				ArgazipaSayMdComponent({
					emotion: "ℹ️",
					phrase: "Отменена бронь билета",
				}),
				MD.br,
				TicketMdComponent({ ticket }),
				MD.br,
				PlaceMdComponent({ place }),
				MD.br,
				EventMdComponent({ event })
			)
		);
	});
