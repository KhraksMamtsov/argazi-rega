import { Schema } from "@effect/schema";

export const _TelegramAuthMiniAppDataSchema = Schema.parseJson(
	Schema.struct({
		data: Schema.struct({
			code: Schema.string,
			session_state: Schema.string,
		}),
		id: Schema.literal(
			"@argazi/infrastructure/telegram-bot/telegram-auth-mini-app/auth"
		),
	})
);

export type TelegramAuthMiniAppDataFrom = Schema.Schema.From<
	typeof _TelegramAuthMiniAppDataSchema
>;
export type TelegramAuthMiniAppData = Schema.Schema.To<
	typeof _TelegramAuthMiniAppDataSchema
>;

export const TelegramAuthMiniAppDataSchema: Schema.Schema<
	TelegramAuthMiniAppData,
	TelegramAuthMiniAppDataFrom
> = _TelegramAuthMiniAppDataSchema;
