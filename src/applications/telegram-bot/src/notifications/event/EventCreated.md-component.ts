import { Effect } from "effect";

import type { Event } from "@argazi/domain";
import type { Place } from "@argazi/domain";

import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { EventMdComponent } from "../../ui/Event.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { PlaceMdComponent } from "../../ui/Place.md-component.js";

export const EventCreatedMdComponent = (props: {
  event: Event;
  place: Place;
}) =>
  Effect.gen(function* () {
    const { place, event } = props;

    return yield* MD.document(
      ArgazipaSayMdComponent({ emotion: "ℹ️", phrase: "Создано событие" }),
      MD.br,
      PlaceMdComponent({ place }),
      MD.br,
      EventMdComponent({ event })
    );
  });
