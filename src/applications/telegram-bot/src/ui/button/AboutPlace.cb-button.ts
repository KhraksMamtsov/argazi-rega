import { Effect } from "effect";
import { Markup } from "telegraf";

import type { IdPlace } from "@argazi/domain";

import { encode } from "../../callback-query/CallbackQuery.js";

export const AboutPlaceCbButton = (props: { id: IdPlace }) =>
  Effect.succeed(
    Markup.button.callback(
      "🏡 О Месте",
      encode({
        action: "get",
        id: props.id,
        type: "Place",
      })
    )
  );
