import { Schema } from "@effect/schema";

export const IdTelegramChatSymbol: unique symbol = Symbol.for(
  "IdTelegramChatSymbol"
);
export const IdTelegramChatSchema = Schema.Number.pipe(
  Schema.identifier("IdTelegramChatSchema"),
  Schema.brand(IdTelegramChatSymbol)
);

export type IdTelegramChat = Schema.Schema.Type<typeof IdTelegramChatSchema>;
