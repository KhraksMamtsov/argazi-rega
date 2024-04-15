import { Schema } from "@effect/schema";

export const _TelegramAuthMiniAppDataSchema = Schema.parseJson(
  Schema.Struct({
    data: Schema.Struct({
      code: Schema.String,
      session_state: Schema.String,
    }),
    id: Schema.Literal(
      "@argazi/infrastructure/telegram-bot/telegram-auth-mini-app/auth"
    ),
  })
);

export type TelegramAuthMiniAppDataFrom = Schema.Schema.Encoded<
  typeof _TelegramAuthMiniAppDataSchema
>;
export type TelegramAuthMiniAppData = Schema.Schema.Type<
  typeof _TelegramAuthMiniAppDataSchema
>;

export const TelegramAuthMiniAppDataSchema: Schema.Schema<
  TelegramAuthMiniAppData,
  TelegramAuthMiniAppDataFrom
> = _TelegramAuthMiniAppDataSchema;
