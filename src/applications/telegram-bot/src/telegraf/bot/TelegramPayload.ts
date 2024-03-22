import { Data, Effect } from "effect";
import * as _Telegraf from "telegraf";

import type { IdTelegramChat } from "@argazi/domain";

import {
	TelegrafCtxReplyWithMarkdownError,
	TelegrafCtxEditMessageTextError,
} from "./TelegrafContextError.js";

import type { UnknownException } from "effect/Cause";
import type {
	CallbackQuery,
	Convenience,
	Message,
	Update,
} from "telegraf/types";

export type UpdateTextContext = _Telegraf.Context;

export enum TelegrafBotPayload {
	CALLBACK_QUERY = "CALLBACK_QUERY::TelegrafBotPayload",
	COMMAND = "COMMAND::TelegrafBotPayload",
	TEXT = "TEXT::TelegrafBotPayload",
	WEB_APP_DATA = "WEB_APP_DATA::TelegrafBotPayload",
}

export class TextPayload extends Data.TaggedClass(TelegrafBotPayload.TEXT)<{
	readonly editMessageText: ReturnType<typeof editMessageText>;
	readonly idTelegramChat: IdTelegramChat;
	readonly message: Update.New & Update.NonChannel & Message.TextMessage;
	readonly replyWithMarkdown: ReturnType<typeof replyWithMarkdown>;
}> {}

export class WebAppDataPayload extends Data.TaggedClass(
	TelegrafBotPayload.WEB_APP_DATA
)<{
	readonly idTelegramChat: IdTelegramChat;
	readonly message: Update.New &
		Update.NonChannel &
		Record<"web_app_data", {}> &
		Message.WebAppDataMessage;
	readonly replyWithMarkdown: ReturnType<typeof replyWithMarkdown>;
}> {}

export class CommandPayload<const CS extends string> extends Data.TaggedClass(
	TelegrafBotPayload.COMMAND
)<{
	readonly command: CS;
	readonly editMessageText: ReturnType<typeof editMessageText>;
	readonly idTelegramChat: IdTelegramChat;
	readonly message: Update.New & Update.NonChannel & Message.TextMessage;
	readonly replyWithMarkdown: ReturnType<typeof replyWithMarkdown>;
}> {
	static readonly isOfCommand =
		<const C extends string>(command: C) =>
		(
			commandPayload: CommandPayload<string>
		): commandPayload is CommandPayload<C> =>
			commandPayload.command === command;
}

export class CallbackQueryPayload extends Data.TaggedClass(
	TelegrafBotPayload.CALLBACK_QUERY
)<{
	readonly callback_query: Record<"data", {}> & CallbackQuery.DataQuery;
	readonly editMessageText: ReturnType<typeof editMessageText>;
	readonly idTelegramChat: IdTelegramChat;
	readonly message: Message.TextMessage;
	readonly replyWithMarkdown: ReturnType<typeof replyWithMarkdown>;
	readonly sendLocation: (
		latitude: number,
		longitude: number,
		extra?: _Telegraf.Types.ExtraLocation
	) => Effect.Effect<Message.LocationMessage, UnknownException>;
}> {}

export const replyWithMarkdown =
	(context: UpdateTextContext) =>
	(markdown: string, extra: Convenience.ExtraReplyMessage) =>
		Effect.tryPromise({
			catch: (error) =>
				new TelegrafCtxReplyWithMarkdownError({ error, extra, markdown }),
			try: () => context.replyWithMarkdownV2(markdown, extra),
		});

export const editMessageText =
	(context: UpdateTextContext, chatId?: number) =>
	(
		markdown: string,
		messageId: number,
		extra: Convenience.ExtraEditMessageText
	) =>
		Effect.tryPromise({
			catch: (error) =>
				new TelegrafCtxEditMessageTextError({ error, extra, markdown }),
			try: () =>
				context.telegram.editMessageText(
					chatId ?? context.message?.chat.id,
					messageId,
					undefined,
					markdown,
					extra
				),
		});
