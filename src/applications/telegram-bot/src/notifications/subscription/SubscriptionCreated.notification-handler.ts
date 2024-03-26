import { Effect } from "effect";
import { Markup } from "telegraf";

import type { Subscription } from "@argazi/domain";
import type { User } from "@argazi/domain";

import { SubscriptionCreatedMdComponent } from "./SubscriptionCreated.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { UnsubscribePlaceCbButton } from "../../ui/button/UnsubscribePlace.cb-button.js";

export const SubscriptionCreatedNotificationHandler = (args: {
  readonly createdSubscription: Subscription;
  readonly initiator: User;
  readonly user: User;
}) =>
  Effect.gen(function* (_) {
    const telegraf = yield* _(TelegrafTag);
    const restApiService = yield* _(RestApiServiceTag);

    const place = yield* _(
      restApiService.getPlaceById({
        path: { idPlace: args.createdSubscription.idPlace },
      })
    );

    yield* _(
      telegraf.sendMessage(
        args.user.idTelegramChat,
        yield* _(
          SubscriptionCreatedMdComponent({
            place,
          })
        ),
        Markup.inlineKeyboard([
          yield* _(
            UnsubscribePlaceCbButton({
              id: args.createdSubscription.id,
            })
          ),
        ])
      )
    );
  });
