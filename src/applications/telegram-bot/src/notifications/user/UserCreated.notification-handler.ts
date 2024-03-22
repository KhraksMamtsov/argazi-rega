import { Effect, ReadonlyArray } from "effect";

import type { User } from "@argazi/domain";

import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { ArgazipaSayMdComponent } from "../../ui/ArgazipaSay.md-component.js";
import { MD } from "../../ui/Markdown.js";
import { UserMdComponent } from "../../ui/User.md-component.js";

export const UserCreatedNotificationHandler = (args: {
	readonly createdUser: User;
	readonly initiator: User;
}) =>
	Effect.gen(function* (_) {
		const bot = yield* _(TelegrafTag);

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
				).pipe(Effect.flatMap((text) => bot.sendMessage(x, text)))
			),
			Effect.allWith({
				concurrency: "unbounded",
			})
		);
	});
