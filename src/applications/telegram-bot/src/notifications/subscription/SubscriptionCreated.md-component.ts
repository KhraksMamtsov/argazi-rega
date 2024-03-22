import { Effect } from "effect";

import type { Place } from "@argazi/domain";

import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { PlaceMdComponent } from "../../ui/Place.md-component.js";

export const SubscriptionCreatedMdComponent = (props: { place: Place }) =>
  Effect.gen(function* (_) {
    const { place } = props;

    return yield* _(
      MD.document(
        ArgazipaSayMdComponent({ emotion: "ℹ️", phrase: "Оформлена подписка" }),
        MD.br,
        PlaceMdComponent({ place })
      )
    );
  });
