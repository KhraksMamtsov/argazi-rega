import { Schema } from "@effect/schema";

export const CallbackQueryAction = Schema.literal(
  //
  "create",
  "delete",
  "get"
);
export const CallbackQueryEntity = Schema.literal(
  "Subscription",
  "GeoPoint",
  "Ticket",
  "Place",
  "Visitor"
);

export class CallbackQuery extends Schema.TaggedClass<CallbackQuery>()(
  "CallbackQuery",
  {
    action: CallbackQueryAction,
    entity: CallbackQueryEntity,
  }
) {
  static readonly decode = Schema.decode(CallbackQuery);
}
