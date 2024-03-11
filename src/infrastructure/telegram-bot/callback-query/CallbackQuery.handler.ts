import { absurd, Effect, Option, Secret } from "effect";
import { Markup } from "telegraf";

import { decode, encode } from "./CallbackQuery.js";

import { RestApiServiceTag } from "../RestApiService.js";
import {
	CallbackQueryPayload,
	type TelegrafBot,
} from "../telegraf/TelegrafBot.js";

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
							body: {
								idPlace: callbackQuery.id,
							},
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

				const message = yield* _(
					args.bot.sendMessage(
						args.callbackQueryPayload.message.chat.id,
						`${place.name} - ${geoPoint.name.pipe(
							Option.map(Secret.value),
							Option.getOrElse(() => "__")
						)}`,
						{
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
						}
					)
				);

				return [message, locationMessage];
			}
		}

		return absurd<typeof Effect.unit>(callbackQuery);
	});
