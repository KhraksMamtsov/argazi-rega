import { Effect } from "effect";

import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { EventMdComponent } from "../../ui/Event.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { PlaceMdComponent } from "../../ui/Place.md-component.js";

import type { Event } from "../../../../domain/event/entity/Event.js";
import type { Place } from "../../../../domain/place/entity/Place.js";

export const EventCreatedMdComponent = (props: {
	event: Event;
	place: Place;
}) =>
	Effect.gen(function* (_) {
		const { place, event } = props;

		return yield* _(
			MD.document(
				ArgazipaSayMdComponent({ emotion: "ℹ️", phrase: "Создано событие" }),
				MD.br,
				PlaceMdComponent({ place }),
				MD.br,
				EventMdComponent({ event })
			)
		);
	});
