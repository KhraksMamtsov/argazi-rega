import { Effect, flow, Option, pipe, ReadonlyArray } from "effect";
import { Markup } from "telegraf";

import { MyEvents } from "./TelegramCommands.js";

import { fromArray } from "../../../libs/ReadonlyArray.js";
import { RestApiServiceTag } from "../RestApiService.js";
import { ArgazipaSayMdComponent } from "../ui/ArgazipaSay.md-component.js";
import { BookTicketCbButton } from "../ui/button/BookTicket.cb-button.js";
import { ReturnTicketCbButton } from "../ui/button/ReturnTicket.cb-button.js";
import { EventMdComponent } from "../ui/Event.md-component.js";
import { MD } from "../ui/Markdown.js";
import { TicketMdComponent } from "../ui/Ticket.md-component.js";

import type { CommandPayload } from "../telegraf/bot/TelegramPayload.js";

export const EventsCommandHandler = (args: {
	readonly command: CommandPayload<typeof MyEvents.command>;
}) =>
	Effect.gen(function* (_) {
		const restApiService = yield* _(RestApiServiceTag);
		const restApiUserClient = yield* _(
			restApiService.__new.getUserApiClientFor(args.command.idTelegramChat)
		);

		const { userSubscriptions, userTickets } = yield* _(
			Effect.all(
				{
					userSubscriptions: restApiUserClient.getMySubscriptions({}),
					userTickets: restApiUserClient.getMyTickets({}),
				},
				{ concurrency: "unbounded" }
			)
		);

		const userPlacesActualEvents = yield* _(
			userSubscriptions,
			ReadonlyArray.map((x) =>
				restApiUserClient.getPlaceActualEvents({
					params: { idPlace: x.idPlace },
				})
			),
			Effect.allWith({
				concurrency: 4,
			}),
			Effect.map(flow(ReadonlyArray.flatten, fromArray)),
			Effect.tapBoth({
				onFailure: Effect.logError,
				onSuccess: Effect.logInfo,
			})
		);

		const replies = pipe(
			userPlacesActualEvents,
			Option.match({
				onNone: () =>
					ReadonlyArray.of(
						ArgazipaSayMdComponent({
							emotion: "😳",
							phrase: "Нет актуальных событий",
						}).pipe(
							Effect.flatMap((x) => args.command.replyWithMarkdown(x, {}))
						)
					),
				onSome: ReadonlyArray.map((actualEvent) => {
					const eventTicket = ReadonlyArray.findFirst(
						userTickets,
						(x) => x.idEvent === actualEvent.id
					);

					const ticketPart = Option.match(eventTicket, {
						onNone: () => MD.dl()(["Участие", "❌"]),
						onSome: (ticket) =>
							MD.document(
								MD.dl()(["Участие", "✅"]),
								MD.br,
								TicketMdComponent({ ticket })
							),
					});

					const answer = MD.document(
						EventMdComponent({
							event: actualEvent,
						}),
						MD.br,
						ticketPart
					);

					const ticketButton = Option.match(eventTicket, {
						onNone: () => BookTicketCbButton({ id: actualEvent.id }),
						onSome: (ticket) => ReturnTicketCbButton({ ticket }),
					});

					return Effect.zip(answer, ticketButton).pipe(
						Effect.flatMap((data) =>
							args.command.replyWithMarkdown(
								data[0],
								Markup.inlineKeyboard([data[1]])
							)
						)
					);
				}),
			})
		);

		return yield* _(
			Effect.all(replies, { concurrency: "unbounded", mode: "either" }),
			Effect.tap(Effect.log)
		);
	});
