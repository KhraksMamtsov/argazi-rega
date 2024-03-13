import { Effect } from "effect";

import { RestApiServiceTag } from "../RestApiService.js";
import { CommandPayload } from "../telegraf/TelegrafBot.js";
import { UserMdComponent } from "../ui/User.md-component.js";

export const MeCommandHandler = (args: {
	readonly command: CommandPayload<"me">;
}) =>
	Effect.gen(function* (_) {
		const restApiService = yield* _(RestApiServiceTag);
		const restApiUserClient = yield* _(
			restApiService.__new.getUserApiClientFor(args.command.idTelegramChat)
		);

		const myIdentity = yield* _(restApiUserClient.getMyIdentity({}));

		const answer = yield* _(UserMdComponent({ user: myIdentity }));

		return yield* _(
			args.command.replyWithMarkdown(answer, {}),
			Effect.either,
			Effect.tap(Effect.log)
		);
	});
