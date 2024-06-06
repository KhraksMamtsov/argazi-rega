import { Effect, Redacted, Option, pipe } from "effect";

import type { GeoPoint } from "@argazi/domain";

import { MD } from "./Markdown.js";

export const GeoPointMdComponent = (props: { geoPoint: GeoPoint }) =>
  Effect.gen(function* (_) {
    const { geoPoint } = props;
    const headline = Option.match(geoPoint.name, {
      onNone: () => "📍 Геоточка",
      onSome: (x) => MD.line("📍 Геоточка: ", MD.bold(Redacted.value(x))),
    });

    return yield* MD.document(
      MD.headline(headline),
      MD.dl()(
        ["Широта", pipe(geoPoint.latitude, Redacted.value, MD.escape, MD.bold)],
        [
          "Долгота",
          pipe(geoPoint.longitude, Redacted.value, MD.escape, MD.bold),
        ]
      )
    );
  });
