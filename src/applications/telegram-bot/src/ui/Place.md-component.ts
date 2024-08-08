import { Effect, Option } from "effect";

import type { Place } from "@argazi/domain";

import { MD } from "./Markdown.js";
import { EmptyMdComponent } from "./Empty.md-component.js";

export const PlaceMdComponent = (props: { place: Place }) =>
  Effect.gen(function* () {
    const { place } = props;

    return yield* MD.document(
      MD.headline(MD.line("🏡 Место: ", MD.bold(place.name))),
      MD.dl()([
        "Описание",
        place.description.pipe(
          Option.map(MD.escape),
          Option.getOrElse(() => EmptyMdComponent())
        ),
      ])
    );
  });
