import { Effect } from "effect";

import type { Place } from "@argazi/domain";

import { MD } from "./Markdown.js";

export const PlaceMdComponent = (props: { place: Place }) =>
  Effect.gen(function* (_) {
    const { place } = props;

    return yield* _(
      MD.document(MD.headline(MD.line("🏡 Место: ", MD.bold(place.name))))
    );
  });
