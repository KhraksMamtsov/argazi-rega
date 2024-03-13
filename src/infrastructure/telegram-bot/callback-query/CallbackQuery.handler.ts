import { absurd, Effect, Secret } from "effect";
import { Markup } from "telegraf";

import { decode, encode } from "./CallbackQuery.js";

import { RestApiServiceTag } from "../RestApiService.js";
import {
	CallbackQueryPayload,
	type TelegrafBot,
} from "../telegraf/TelegrafBot.js";
import { GeoPointMdComponent } from "../ui/GeoPoint.md-component.js";
import { MD } from "../ui/Markdown.js";
import { PlaceMdComponent } from "../ui/Place.md-component.js";

import type { AccessToken } from "../../rest-api/authentication/AccessToken.js";

export const CallbackQueryHandler = (args: {
	readonly accessToken: AccessToken;
	readonly bot: TelegrafBot;
	readonly callbackQueryPayload: CallbackQueryPayload;
}) =>
	Effect.gen(function* (_) {
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
				const deletedUserSubscription = yield* _(
					RestApiServiceTag.deleteMySubscription(
						{
							params: { idSubscription: callbackQuery.id },
						},
						{
							bearer: args.accessToken,
						}
					)
				);

				return yield* _(
					args.callbackQueryPayload.editMessageText(
						args.callbackQueryPayload.message.text,
						args.callbackQueryPayload.message.message_id,
						{
							reply_markup: {
								inline_keyboard: [
									[
										Markup.button.callback(
											"Подробнее",
											encode({
												action: "get",
												id: deletedUserSubscription.idPlace,
												type: "Place",
											})
										),
										Markup.button.callback(
											"🔔 Подписаться",
											encode({
												action: "create",
												id: deletedUserSubscription.idPlace,
												type: "Subscription",
											})
										),
									],
								],
							},
						}
					)
				);
			}
			if (callbackQuery.action === "create") {
				const createdSubscription = yield* _(
					RestApiServiceTag.createMySubscription(
						{
							body: { idPlace: callbackQuery.id },
						},
						{ bearer: args.accessToken }
					)
				);

				return yield* _(
					args.callbackQueryPayload.editMessageText(
						args.callbackQueryPayload.message.text,
						args.callbackQueryPayload.message.message_id,
						{
							reply_markup: {
								inline_keyboard: [
									[
										Markup.button.callback(
											"Подробнее",
											encode({
												action: "get",
												id: callbackQuery.id,
												type: "Place",
											})
										),
										Markup.button.callback(
											"🔕 Отписаться",
											encode({
												action: "delete",
												id: createdSubscription.id,
												type: "Subscription",
											})
										),
									],
								],
							},
						}
					)
				);
			}
		}
		if (callbackQuery.type === "Place") {
			if (callbackQuery.action === "get") {
				const place = yield* _(
					RestApiServiceTag.getPlaceById({
						params: { id: callbackQuery.id },
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
					args.bot.sendMessage(
						args.callbackQueryPayload.message.chat.id,
						answer,
						{
							parse_mode: "MarkdownV2",
							protect_content: true,
						}
					)
				);

				const locationMessage = yield* _(
					args.callbackQueryPayload.sendLocation(
						Number(Secret.value(geoPoint.latitude)),
						Number(Secret.value(geoPoint.longitude)),
						{
							horizontal_accuracy: 100,
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
