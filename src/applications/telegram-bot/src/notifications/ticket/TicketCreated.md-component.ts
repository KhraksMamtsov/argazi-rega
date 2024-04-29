import { Effect } from "effect";

import type { Event } from "@argazi/domain";
import type { Place } from "@argazi/domain";
import type { Ticket } from "@argazi/domain";

import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { EventMdComponent } from "../../ui/Event.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { PlaceMdComponent } from "../../ui/Place.md-component.js";
import { TicketMdComponent } from "../../ui/Ticket.md-component.js";

export const TicketCreatedMdComponent = (props: {
  event: Event;
  place: Place;
  ticket: Ticket;
}) =>
  Effect.gen(function* (_) {
    const { place, event, ticket } = props;

    return yield* MD.document(
      ArgazipaSayMdComponent({ emotion: "ℹ️", phrase: "Забронирован билет" }),
      MD.br,
      TicketMdComponent({ ticket }),
      MD.br,
      PlaceMdComponent({ place }),
      MD.br,
      EventMdComponent({ event })
    );
  });
