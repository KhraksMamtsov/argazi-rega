import { absurd, Effect, Secret } from "effect";
import { Client } from "effect-http";

import type { AccessToken } from "@argazi/rest-api";

import { decode } from "./CallbackQuery.js";

import { RestApiServiceTag } from "../RestApiService.js";
// import { TelegrafTag } from "../telegraf/Telegraf.js";
import { GeoPointMdComponent } from "../ui/GeoPoint.md-component.js";
import { MD } from "../ui/Markdown.js";
import { PlaceMdComponent } from "../ui/Place.md-component.js";

import type { CallbackQueryPayload } from "../telegraf/bot/TelegramPayload.js";

export const CallbackQueryHandler = (args: {
  readonly accessToken: AccessToken;
  readonly callbackQueryPayload: CallbackQueryPayload;
}) =>
  Effect.gen(function* (_) {
    const restApiService = yield* _(RestApiServiceTag);
    const callbackQuery = yield* _(
      decode(args.callbackQueryPayload.callback_query.data)
    );

    if (callbackQuery.type === "Ticket") {
      if (callbackQuery.action === "delete") {
        return yield* _(
          restApiService.returnMyTicket(
            {
              path: {
                idTicket: callbackQuery.id,
              },
            },
            Client.setBearer(Secret.value(args.accessToken))
          )
        );
      } else if (callbackQuery.action === "create") {
        return yield* _(
          restApiService.bookMyTicket(
            {
              body: {
                idEvent: callbackQuery.id,
              },
            },

            Client.setBearer(Secret.value(args.accessToken))
          )
        );
      }
    } else if (callbackQuery.type === "Subscription") {
      if (callbackQuery.action === "delete") {
        return yield* _(
          restApiService.deleteMySubscription(
            {
              path: { idSubscription: callbackQuery.id },
            },
            Client.setBearer(Secret.value(args.accessToken))
          )
        );
      }
      if (callbackQuery.action === "create") {
        return yield* _(
          restApiService.createMySubscription(
            {
              body: { idPlace: callbackQuery.id },
            },
            Client.setBearer(Secret.value(args.accessToken))
          )
        );
      }
    }
    if (callbackQuery.type === "Place") {
      if (callbackQuery.action === "get") {
        const place = yield* _(
          restApiService.getPlaceById({
            path: { idPlace: callbackQuery.id },
          })
        );

        const geoPoint = yield* _(
          restApiService.getPlaceGeoPoint({
            path: { idPlace: place.id },
          })
        );

        const answer = yield* _(
          MD.document(
            PlaceMdComponent({
              place,
            }),
            MD.br,
            GeoPointMdComponent({
              geoPoint,
            })
          )
        );

        const message = yield* _(
          args.callbackQueryPayload.replyWithMarkdown(answer, {
            protect_content: true,
          })
        );

        const locationMessage = yield* _(
          args.callbackQueryPayload.sendLocation(
            Number(Secret.value(geoPoint.latitude)),
            Number(Secret.value(geoPoint.longitude)),
            {
              horizontal_accuracy: 1500,
              protect_content: true,
              reply_parameters: {
                message_id: message.message_id,
              },
            }
          )
        );

        return [message, locationMessage];
      }
    }
    if (callbackQuery.type === "Visitor") {
      if (callbackQuery.action === "delete") {
        return yield* _(
          restApiService.deleteMyVisitor(
            {
              path: { idVisitor: callbackQuery.id },
            },
            Client.setBearer(Secret.value(args.accessToken))
          )
        );
      }
    }

    return absurd<typeof Effect.void>(callbackQuery);
  });
