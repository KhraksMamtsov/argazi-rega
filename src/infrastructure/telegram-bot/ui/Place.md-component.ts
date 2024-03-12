import { Effect } from "effect";

import { MD } from "./Markdown.js";

import type { Place } from "../../../domain/place/entity/Place.js";

export const PlaceMdComponent = (props: { place: Place }) =>
	Effect.gen(function* (_) {
		const { place } = props;

		return yield* _(MD.document(MD.headline("📍 " + place.name)));
	});

export const PlaceInfoMdComponent = (props: { place: Place }) =>
	Effect.gen(function* (_) {
		const { place } = props;

		return yield* _(
			MD.dl()([MD.underline("📍 Место"), MD.bold(MD.escape(place.name))])
		);
	});
