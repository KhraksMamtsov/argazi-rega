import { Effect } from "effect";

import { SessionServiceTag } from "../Session.service.js";
import { CommandPayload } from "../telegraf/TelegrafBot.js";
import { ArgazipaSayMdComponent } from "../ui/ArgazipaSay.md-component.js";

export const LogoutCommandHandler = (args: {
	readonly command: CommandPayload<"logout">;
}) =>
	Effect.gen(function* (_) {
		const sessionService = yield* _(SessionServiceTag);

		yield* _(sessionService.drop(args.command.idTelegramChat));

		const answer = yield* _(
			ArgazipaSayMdComponent({ phrase: "До встречи", emotion: "👋" })
		);

		return yield* _(
			args.command.replyWithMarkdown(answer, {}),
			Effect.either,
			Effect.tap(Effect.log)
		);
	});
