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
  Effect.gen(function* () {
    const telegraf = yield* TelegrafTag;
    const restApiService = yield* RestApiServiceTag;

    const place = yield* restApiService.getPlaceById({
      path: { idPlace: args.createdSubscription.idPlace },
    });

    yield* telegraf.sendMessage(
      args.user.idTelegramChat,
      yield* SubscriptionCreatedMdComponent({
        place,
      }),
      Markup.inlineKeyboard([
        yield* UnsubscribePlaceCbButton({
          id: args.createdSubscription.id,
        }),
      ])
    );
  });
