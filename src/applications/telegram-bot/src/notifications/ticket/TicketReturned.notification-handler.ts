import { Effect } from "effect";
import { Markup } from "telegraf";

import type { Ticket } from "@argazi/domain";
import type { User } from "@argazi/domain";

import { TicketReturnedMdComponent } from "./TicketReturned.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { BookTicketCbButton } from "../../ui/button/BookTicket.cb-button.js";

export const TicketReturnedNotificationHandler = (args: {
  readonly createdTicket: Ticket;
  readonly initiator: User;
  readonly user: User;
}) =>
  Effect.gen(function* (_) {
    const telegraf = yield* TelegrafTag;
    const restApiClient = yield* RestApiServiceTag;

    const event = yield* restApiClient.getEvent({
      path: {
        idEvent: args.createdTicket.idEvent,
      },
    });

    const place = yield* restApiClient.getPlaceById({
      path: {
        idPlace: event.idPlace,
      },
    });

    yield* telegraf.sendMessage(
      args.user.idTelegramChat,
      yield* TicketReturnedMdComponent({
        event,
        place,
        ticket: args.createdTicket,
      }),
      Markup.inlineKeyboard([yield* BookTicketCbButton({ id: event.id })])
    );
  });
