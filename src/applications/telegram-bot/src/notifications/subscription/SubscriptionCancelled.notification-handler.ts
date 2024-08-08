import { Effect } from "effect";
import { Markup } from "telegraf";

import type { Subscription } from "@argazi/domain";
import type { User } from "@argazi/domain";

import { SubscriptionCancelledMdComponent } from "./SubscriptionCancelled.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { SubscribePlaceCbButton } from "../../ui/button/SubscribePlace.cb-button.js";

export const SubscriptionCancelledNotificationHandler = (args: {
  readonly cancelledSubscription: Subscription;
  readonly initiator: User;
  readonly user: User;
}) =>
  Effect.gen(function* () {
    const telegraf = yield* TelegrafTag;
    const restApiClient = yield* RestApiServiceTag;

    const place = yield* restApiClient.getPlaceById({
      path: {
        idPlace: args.cancelledSubscription.idPlace,
      },
    });

    yield* telegraf.sendMessage(
      args.user.idTelegramChat,
      yield* SubscriptionCancelledMdComponent({ place }),
      Markup.inlineKeyboard([yield* SubscribePlaceCbButton({ id: place.id })])
    );
  });
