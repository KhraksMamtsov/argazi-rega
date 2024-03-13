import { Effect, flow, Option, pipe, ReadonlyArray } from "effect";

import { fromArray } from "../../../libs/ReadonlyArray.js";
import { RestApiServiceTag } from "../RestApiService.js";
import { CommandPayload } from "../telegraf/TelegrafBot.js";
import { EventMdComponent } from "../ui/Event.md-component.js";
import { MD } from "../ui/Markdown.js";
import { TicketMdComponent } from "../ui/Ticket.md-component.js";

export const EventsCommandHandler = (args: {
	readonly command: CommandPayload<"events">;
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
						args.command.replyWithMarkdown("Нет актуальных событий", {})
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

					return answer.pipe(
						Effect.flatMap((x) =>
							args.command.replyWithMarkdown(x, {
								parse_mode: "MarkdownV2",
							})
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
