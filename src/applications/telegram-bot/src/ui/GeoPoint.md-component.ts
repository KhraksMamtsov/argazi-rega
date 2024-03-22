import { Effect, Secret, Option, pipe } from "effect";

import type { GeoPoint } from "@argazi/domain";

import { MD } from "./Markdown.js";

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
