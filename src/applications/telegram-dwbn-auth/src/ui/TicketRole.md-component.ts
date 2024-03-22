import { Effect, ReadonlyRecord } from "effect";

import { TicketRole } from "@argazi/domain";

import { MD } from "./Markdown.js";

const tickerRoleToString: ReadonlyRecord.ReadonlyRecord<TicketRole, string> = {
	[TicketRole.ADMIN]: "Админ",
	[TicketRole.CASHIER]: "Кассир",
	[TicketRole.CHIEF]: "Шеф",
	[TicketRole.LEAD]: "Ведущий",
	[TicketRole.NONE]: "Участник",
};

const tickerRoleToEmoji: ReadonlyRecord.ReadonlyRecord<TicketRole, string> = {
	[TicketRole.ADMIN]: "🧑‍🚒",
	[TicketRole.CASHIER]: "🧑‍💼",
	[TicketRole.CHIEF]: "🧑‍🍳",
	[TicketRole.LEAD]: "🧑‍✈️",
	[TicketRole.NONE]: "🧘",
};

export const TicketRoleMdComponent = (props: { ticketRole: TicketRole }) =>
	Effect.gen(function* (_) {
		const { ticketRole } = props;

		return MD.escape(
			`${tickerRoleToString[ticketRole]} ${tickerRoleToEmoji[ticketRole]}`
		);
	});
