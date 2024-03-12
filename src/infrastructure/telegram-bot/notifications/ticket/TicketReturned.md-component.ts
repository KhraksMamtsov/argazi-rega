import { Secret, Effect } from "effect";

import { EventInfoMdComponent } from "../../ui/Event.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { PlaceInfoMdComponent } from "../../ui/Place.md-component.js";

import type { Event } from "../../../../domain/event/entity/Event.js";
import type { Place } from "../../../../domain/place/entity/Place.js";
import type { Ticket } from "../../../../domain/ticket/entity/Ticket.js";

export const TicketInfoMdComponent = (props: {
	event: Event;
	place: Place;
	ticket: Ticket;
}) =>
	Effect.gen(function* (_) {
		const { place, event } = props;

		return yield* _(
			MD.document(
				MD.headline(MD.pipe(Secret.value(event.name), MD.escape, MD.bold)),
				MD.br,
				PlaceInfoMdComponent({ place }),
				EventInfoMdComponent({ event })
			)
		);
	});

export const TicketReturnedMdComponent = (props: {
	event: Event;
	place: Place;
	ticket: Ticket;
}) =>
	Effect.gen(function* (_) {
		const { place, event } = props;

		return yield* _(
			MD.document(
				MD.headline(MD.pipe(Secret.value(event.name), MD.escape, MD.bold)),
				MD.br,
				PlaceInfoMdComponent({ place }),
				EventInfoMdComponent({ event })
			)
		);
	});
