import { Effect, flow, Option, pipe, ReadonlyArray, Secret } from "effect";

import { fromArray } from "../../../libs/ReadonlyArray.js";
import { RestApiServiceTag } from "../RestApiService.js";
import { CommandPayload } from "../telegraf/TelegrafBot.js";
import { MD } from "../ui/Markdown.js";

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
					const escapedEventName = MD.escape(Secret.value(actualEvent.name));
					const eventTicket = ReadonlyArray.findFirst(
						userTickets,
						(x) => x.idEvent === actualEvent.id
					);

					const answer = [
						`**${escapedEventName}**`,
						[
							"Начало",
							MD.escape(
								new Intl.DateTimeFormat("ru-RU", {
									dateStyle: "short",
									timeStyle: "short",
								}).format(actualEvent.dateStart)
							),
						].join(": "),
						[
							"Участие",
							MD.escape(
								Option.match(eventTicket, {
									onNone: () => "-",
									onSome: (x) => x.role,
								})
							),
						].join(": "),
					].join("\n");

					return args.command.replyWithMarkdown(answer, {});
				}),
			})
		);

		return yield* _(
			Effect.all(replies, { concurrency: "unbounded", mode: "either" }),
			Effect.tap(Effect.log)
		);
	});
