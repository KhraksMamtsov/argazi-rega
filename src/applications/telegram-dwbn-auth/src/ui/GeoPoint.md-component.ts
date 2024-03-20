import { Effect, Secret, Option, pipe } from "effect";

import { MD } from "./Markdown.js";

import type { GeoPoint } from "../../../libraries/domain/src/geo-point/entity/GeoPoint.js";

export const GeoPointMdComponent = (props: { geoPoint: GeoPoint }) =>
	Effect.gen(function* (_) {
		const { geoPoint } = props;
		const headline = Option.match(geoPoint.name, {
			onNone: () => "📍 Геоточка",
			onSome: (x) => MD.line("📍 Геоточка: ", MD.bold(Secret.value(x))),
		});

		return yield* _(
			MD.document(
				MD.headline(headline),
				MD.dl()(
					["Широта", pipe(geoPoint.latitude, Secret.value, MD.escape, MD.bold)],
					[
						"Долгота",
						pipe(geoPoint.longitude, Secret.value, MD.escape, MD.bold),
					]
				)
			)
		);
	});
