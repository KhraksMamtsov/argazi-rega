import { Schema } from "effect";

export const _TelegramAuthMiniAppData = Schema.parseJson(
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
  typeof _TelegramAuthMiniAppData
>;
export type TelegramAuthMiniAppData = Schema.Schema.Type<
  typeof _TelegramAuthMiniAppData
>;

export const TelegramAuthMiniAppData: Schema.Schema<
  TelegramAuthMiniAppData,
  TelegramAuthMiniAppDataFrom
> = _TelegramAuthMiniAppData;
