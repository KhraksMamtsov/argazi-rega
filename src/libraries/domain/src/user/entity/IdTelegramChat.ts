import { Schema } from "@effect/schema";

export const IdTelegramChatSymbol: unique symbol = Symbol.for(
  "IdTelegramChatSymbol"
);
export const IdTelegramChat = Schema.Number.pipe(
  Schema.identifier("IdTelegramChat"),
  Schema.brand(IdTelegramChatSymbol)
);

export type IdTelegramChat = Schema.Schema.Type<typeof IdTelegramChat>;
