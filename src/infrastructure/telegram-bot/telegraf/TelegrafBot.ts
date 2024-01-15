import { Chunk, Data, Effect, Stream } from "effect";
import * as _Telegraf from "telegraf";
import * as TF from "telegraf/filters";

import {
	type IdTelegramChat,
	IdTelegramChatSchema,
} from "../../../domain/user/entity/IdTelegramChat.js";

import type { UnknownException } from "effect/Cause";
import type {
	Message,
	Update,
	CallbackQuery,
	Convenience,
} from "telegraf/types";

export type UpdateTextContext = _Telegraf.Context;
export type Bot = _Telegraf.Telegraf;

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
	readonly sendLocation: (
		latitude: number,
		longitude: number,
		extra?: _Telegraf.Types.ExtraLocation
	) => Effect.Effect<Message.LocationMessage, UnknownException>;
}> {}

export type TelegrafBot = ReturnType<typeof makeBot>;
export const makeBot = (bot: Bot) => {
	const callbackQuery$ = Stream.async<CallbackQueryPayload>((emit) => {
		bot.on(TF.allOf(TF.callbackQuery("data")), async (context, next) => {
			const { message } = context.update.callback_query;
			if (message === undefined) {
				await next();
				return;
			}
			if (!("text" in message)) {
				await next();
				return;
			}
			await emit(
				Effect.succeed(
					Chunk.of(
						new CallbackQueryPayload({
							callback_query: context.update.callback_query,
							editMessageText: editMessageText(context, message.chat.id),
							idTelegramChat: IdTelegramChatSchema(
								context.update.callback_query.from.id
							),
							message,
							sendLocation: (latitude, longitude, extra) =>
								Effect.tryPromise(() =>
									context.sendLocation(latitude, longitude, extra)
								),
						})
					)
				)
			);
			await next();
		});
	});
	const webAppData$ = Stream.async<WebAppDataPayload>((emit) => {
		bot.on(TF.message("web_app_data"), async (context, next) => {
			await emit(
				Effect.succeed(
					Chunk.of(
						new WebAppDataPayload({
							idTelegramChat: IdTelegramChatSchema(context.message.chat.id),
							message: context.message,
							replyWithMarkdown: replyWithMarkdown(context),
						})
					)
				)
			);
			await next();
		});
	});
	const text$ = Stream.async<TextPayload>((emit) => {
		bot.on(TF.message("text"), async (context, next) => {
			await emit(
				Effect.succeed(
					Chunk.of(
						new TextPayload({
							editMessageText: editMessageText(context),
							idTelegramChat: IdTelegramChatSchema(context.message.chat.id),
							message: context.message,
							replyWithMarkdown: replyWithMarkdown(context),
						})
					)
				)
			);
			await next();
		});
	});

	const command$ = <
		const CS extends ReadonlyArray<string>,
		C extends CS[number],
	>(
		...commands: CS
	) =>
		Stream.async<C extends C ? CommandPayload<C> : never>((emit) => {
			bot.command(/.+/, async (context, next) => {
				if (commands.includes(context.command)) {
					await emit(
						Effect.succeed(
							Chunk.of(
								new CommandPayload({
									command: context.command,
									editMessageText: editMessageText(context),
									idTelegramChat: IdTelegramChatSchema(context.message.chat.id),
									message: context.message,
									replyWithMarkdown: replyWithMarkdown(context),
								}) as any
							)
						)
					);
				}

				await next();
			});
		});

	const sendMessage = (...args: Parameters<typeof bot.telegram.sendMessage>) =>
		Effect.tryPromise({
			catch: (x) =>
				new TelegrafCtxSendMessageError({
					args,
					error: x,
				}),
			try: () => bot.telegram.sendMessage(...args),
		}).pipe(Effect.tapError(Effect.logError));

	return {
		callbackQuery$,
		command$,
		sendMessage,
		text$,
		webAppData$,
	} as const;
};

export enum CtxErrorType {
	EDIT_MESSAGE_TEXT = "EDIT_MESSAGE_TEXT::TelegrafCtxErrorType",
	REPLY_WITH_MARKDOWN = "REPLY_WITH_MARKDOWN::TelegrafCtxErrorType",
	SEND_MESSAGE = "SEND_MESSAGE::TelegrafCtxErrorType",
}

export class TelegrafCtxSendMessageError extends Data.TaggedError(
	CtxErrorType.SEND_MESSAGE
)<{
	readonly args: ReadonlyArray<unknown>;
	readonly error: unknown;
}> {}

export class TelegrafCtxReplyWithMarkdownError extends Data.TaggedError(
	CtxErrorType.REPLY_WITH_MARKDOWN
)<{
	readonly error: unknown;
	readonly extra: Convenience.ExtraReplyMessage;
	readonly markdown: string;
}> {}
export class TelegrafCtxEditMessageTextError extends Data.TaggedError(
	CtxErrorType.EDIT_MESSAGE_TEXT
)<{
	readonly error: unknown;
	readonly extra: Convenience.ExtraEditMessageText;
	readonly markdown: string;
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
