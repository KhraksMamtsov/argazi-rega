import { absurd, Effect, Secret } from "effect";

import { decode } from "./CallbackQuery.js";

import { RestApiServiceTag } from "../RestApiService.js";
// import { TelegrafTag } from "../telegraf/Telegraf.js";
import { GeoPointMdComponent } from "../ui/GeoPoint.md-component.js";
import { MD } from "../ui/Markdown.js";
import { PlaceMdComponent } from "../ui/Place.md-component.js";

import type { AccessToken } from "../../rest-api/authentication/AccessToken.js";
import type { CallbackQueryPayload } from "../telegraf/bot/TelegramPayload.js";

export const CallbackQueryHandler = (args: {
	readonly accessToken: AccessToken;
	readonly callbackQueryPayload: CallbackQueryPayload;
}) =>
	Effect.gen(function* (_) {
		// const _bot = yield* _(TelegrafTag);
		const callbackQuery = yield* _(
			decode(args.callbackQueryPayload.callback_query.data)
		);

		if (callbackQuery.type === "Ticket") {
			if (callbackQuery.action === "delete") {
				return yield* _(
					RestApiServiceTag.returnMyTicket(
						{
							params: {
								idTicket: callbackQuery.id,
							},
						},
						{
							bearer: args.accessToken,
						}
					)
				);
			} else if (callbackQuery.action === "create") {
				return yield* _(
					RestApiServiceTag.bookMyTicket(
						{
							body: {
								idEvent: callbackQuery.id,
							},
						},
						{
							bearer: args.accessToken,
						}
					)
				);
			}
		} else if (callbackQuery.type === "Subscription") {
			if (callbackQuery.action === "delete") {
				return yield* _(
					RestApiServiceTag.deleteMySubscription(
						{
							params: { idSubscription: callbackQuery.id },
						},
						{
							bearer: args.accessToken,
						}
					)
				);
			}
			if (callbackQuery.action === "create") {
				return yield* _(
					RestApiServiceTag.createMySubscription(
						{
							body: { idPlace: callbackQuery.id },
						},
						{ bearer: args.accessToken }
					)
				);
			}
		}
		if (callbackQuery.type === "Place") {
			if (callbackQuery.action === "get") {
				const place = yield* _(
					RestApiServiceTag.getPlaceById({
						params: { idPlace: callbackQuery.id },
					})
				);

				const geoPoint = yield* _(
					RestApiServiceTag.getPlaceGeoPoint({
						params: { idPlace: place.id },
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

		return absurd<typeof Effect.unit>(callbackQuery);
	});
