import { Schema } from "effect";

export const CallbackQueryAction = Schema.Literal(
  //
  "create",
  "delete",
  "get"
);
export const CallbackQueryEntity = Schema.Literal(
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
