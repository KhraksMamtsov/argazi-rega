import { Effect } from "effect";
import { Markup } from "telegraf";

import type { IdVisitor } from "@argazi/domain";

import { encode } from "../../callback-query/CallbackQuery.js";

export const DeleteVisitorCbButton = (props: { idVisitor: IdVisitor }) =>
  Effect.succeed(
    Markup.button.callback(
      "🗑️ Удалить",
      encode({
        action: "delete",
        id: props.idVisitor,
        type: "Visitor",
      })
    )
  );
