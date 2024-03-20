import { Effect, pipe } from "effect";

import { DateMdComponent } from "./Date.md-component.js";
import { MD } from "./Markdown.js";
import { TicketRoleMdComponent } from "./TicketRole.md-component.js";

import type { Ticket } from "../../../libraries/domain/src/ticket/entity/Ticket.js";

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
