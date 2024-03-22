import { Effect, pipe } from "effect";

import type { Ticket } from "@argazi/domain";

import { DateMdComponent } from "./Date.md-component.js";
import { MD } from "./Markdown.js";
import { TicketRoleMdComponent } from "./TicketRole.md-component.js";

export const TicketMdComponent = (props: { ticket: Ticket }) =>
  Effect.gen(function* (_) {
    const { ticket } = props;

    return yield* _(
      MD.document(
        MD.headline("🎟️ Билет"),
        MD.dl()(
          [
            "Дата регистрации",
            pipe(
              DateMdComponent({
                date: ticket.dateRegistered,
              }),
              MD.bold
            ),
          ],
          [
            "Роль",
            pipe(TicketRoleMdComponent({ ticketRole: ticket.role }), MD.bold),
          ]
        )
      )
    );
  });
