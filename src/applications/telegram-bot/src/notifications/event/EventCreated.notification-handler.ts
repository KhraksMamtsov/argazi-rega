import { Effect, Array, pipe } from "effect";
import { Markup } from "telegraf";

import type { Event } from "@argazi/domain";
import type { User } from "@argazi/domain";

import { EventCreatedMdComponent } from "./EventCreated.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { BookTicketCbButton } from "../../ui/button/BookTicket.cb-button.js";

export const EventCreatedNotificationHandler = (args: {
  readonly createdEvent: Event;
  readonly initiator: User;
}) =>
  Effect.gen(function* (_) {
    const telegraf = yield* TelegrafTag;

    // let subscribers: Array<Option.Option<User>> = [];

    const restApiClient = yield* RestApiServiceTag;

    const subscriptionsAnswer = yield* restApiClient.getPlaceSubscriptions({
      path: { idPlace: args.createdEvent.idPlace },
    });

    const place = yield* restApiClient.getPlaceById({
      path: { idPlace: args.createdEvent.idPlace },
    });

    const idSubscribers = subscriptionsAnswer.map((x) => x.idUser);

    const subscribers = yield* restApiClient.getManyUsers({
      body: {
        idsUser: [...idSubscribers, ...idSubscribers],
      },
    });

    const answer = Effect.zip(
      BookTicketCbButton({ id: args.createdEvent.id }),
      EventCreatedMdComponent({ event: args.createdEvent, place })
    );

    return yield* pipe(
      [args.initiator, ...Array.getSomes(subscribers)],
      Array.map((x) => x.idTelegramChat),
      (x) => [...new Set(x)],
      Array.map((x) => {
        return answer.pipe(
          Effect.flatMap((data) =>
            telegraf.sendMessage(x, data[1], Markup.inlineKeyboard([data[0]]))
          )
        );
      }),
      Effect.allWith({
        concurrency: 4,
      })
    );
  });
