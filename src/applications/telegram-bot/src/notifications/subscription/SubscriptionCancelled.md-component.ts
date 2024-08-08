import { Effect } from "effect";

import type { Place } from "@argazi/domain";

import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { PlaceMdComponent } from "../../ui/Place.md-component.js";

export const SubscriptionCancelledMdComponent = (props: { place: Place }) =>
  Effect.gen(function* () {
    const { place } = props;

    return yield* MD.document(
      ArgazipaSayMdComponent({
        emotion: "ℹ️",
        phrase: "Подписка отменена",
      }),
      MD.br,
      PlaceMdComponent({ place })
    );
  });
