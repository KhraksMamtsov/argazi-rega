import { Effect } from "effect";
import { Markup } from "telegraf";

import type { Ticket } from "@argazi/domain";
import type { User } from "@argazi/domain";

import { TicketCreatedMdComponent } from "./TicketCreated.md-component.js";

import { RestApiServiceTag } from "../../RestApiService.js";
import { TelegrafTag } from "../../telegraf/Telegraf.js";
import { ReturnTicketCbButton } from "../../ui/button/ReturnTicket.cb-button.js";

export const TicketCreatedNotificationHandler = (args: {
  readonly createdTicket: Ticket;
  readonly initiator: User;
  readonly user: User;
}) =>
  Effect.gen(function* () {
    const telegraf = yield* TelegrafTag;
    const restApiService = yield* RestApiServiceTag;
    const event = yield* restApiService.getEvent({
      path: { idEvent: args.createdTicket.idEvent },
    });

    const place = yield* restApiService.getPlaceById({
      path: { idPlace: event.idPlace },
    });

    yield* telegraf.sendMessage(
      args.user.idTelegramChat,
      yield* TicketCreatedMdComponent({
        event,
        place,
        ticket: args.createdTicket,
      }),
      Markup.inlineKeyboard([
        yield* ReturnTicketCbButton({ ticket: args.createdTicket }),
      ])
    );
  });
