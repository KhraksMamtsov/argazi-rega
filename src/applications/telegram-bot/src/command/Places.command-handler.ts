import { Effect } from "effect";
import { Markup } from "telegraf";

import { Places } from "./TelegramCommands.js";

import { RestApiServiceTag } from "../RestApiService.js";
import { AboutPlaceCbButton } from "../ui/button/AboutPlace.cb-button.js";
import { SubscribePlaceCbButton } from "../ui/button/SubscribePlace.cb-button.js";
import { UnsubscribePlaceCbButton } from "../ui/button/UnsubscribePlace.cb-button.js";
import { PlaceMdComponent } from "../ui/Place.md-component.js";

import type { CommandPayload } from "../telegraf/bot/TelegramPayload.js";

export const PlacesCommandHandler = (args: {
  readonly command: CommandPayload<typeof Places.command>;
}) =>
  Effect.gen(function* () {
    const restApiService = yield* RestApiServiceTag;
    const restApiUserClient = yield* restApiService.__new.getUserApiClientFor(
      args.command.idTelegramChat
    );

    const places = yield* restApiUserClient.getPlaces({});
    const userSubscriptions = yield* restApiUserClient.getMySubscriptions({});

    const replies = places.map((place) => {
      const placeSubscription = userSubscriptions.find(
        (x) => x.idPlace === place.id
      );

      const buttons = [AboutPlaceCbButton({ id: place.id })];

      if (placeSubscription) {
        buttons.push(UnsubscribePlaceCbButton({ id: placeSubscription.id }));
      } else {
        buttons.push(SubscribePlaceCbButton({ id: place.id }));
      }

      return Effect.zip(PlaceMdComponent({ place }), Effect.all(buttons)).pipe(
        Effect.flatMap((data) =>
          args.command.replyWithMarkdown(data[0], {
            ...Markup.inlineKeyboard(data[1]),
          })
        )
      );
    });

    return yield* Effect.all(replies, {
      concurrency: "unbounded",
      mode: "either",
    });
  });
