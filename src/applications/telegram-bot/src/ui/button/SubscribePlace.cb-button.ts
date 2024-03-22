import { Effect } from "effect";
import { Markup } from "telegraf";

import type { IdPlace } from "@argazi/domain";

import { encode } from "../../callback-query/CallbackQuery.js";

export const SubscribePlaceCbButton = (props: { id: IdPlace }) =>
  Effect.succeed(
    Markup.button.callback(
      "🔔 Подписаться",
      encode({
        action: "create",
        id: props.id,
        type: "Subscription",
      })
    )
  );
