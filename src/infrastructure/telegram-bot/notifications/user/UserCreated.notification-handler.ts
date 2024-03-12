import { Effect, Option, ReadonlyArray, Secret } from "effect";

import type { User } from "../../../../domain/user/entity/User.js";
import type { TelegrafBot } from "../../telegraf/TelegrafBot.js";
import { MD } from "../../ui/Markdown.js";

export const UserCreatedNotificationHandler = (args: {
	readonly bot: TelegrafBot;
	readonly createdUser: User;
	readonly initiator: User;
}) =>
	Effect.gen(function* (_) {
		return yield* _(
			[args.initiator, args.createdUser],
			ReadonlyArray.map((x) => x.idTelegramChat),
			(x) => [...new Set(x)],
			ReadonlyArray.map((x) =>
				args.bot.sendMessage(
					x,
					MD.escape(
						`Создан пользователь ${Secret.value(args.createdUser.firstName)} ${args.createdUser.lastName.pipe(
							Option.map(Secret.value),
							Option.getOrElse(() => "")
						)} ${Secret.value(args.createdUser.email)}`
					),
					{
						parse_mode: "MarkdownV2",
					}
				)
			),
			Effect.allWith({
				concurrency: "unbounded",
			})
		);
	});
