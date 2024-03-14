import { Effect, ReadonlyArray } from "effect";

import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { UserMdComponent } from "../../ui/User.md-component.js";

import type { User } from "../../../../domain/user/entity/User.js";
import type { TelegrafBot } from "../../telegraf/TelegrafBot.js";

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
				MD.document(
					ArgazipaSayMdComponent({
						emotion: "ℹ️",
						phrase: "Создан пользователь",
					}),
					MD.br,
					UserMdComponent({ user: args.createdUser })
				).pipe(Effect.flatMap((text) => args.bot.sendMessage(x, text)))
			),
			Effect.allWith({
				concurrency: "unbounded",
			})
		);
	});
