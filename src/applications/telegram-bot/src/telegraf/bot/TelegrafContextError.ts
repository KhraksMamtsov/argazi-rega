import { Data } from "effect";

import type { Convenience } from "telegraf/types";

export enum TelegrafContextErrorType {
  EDIT_MESSAGE_TEXT = "EDIT_MESSAGE_TEXT::TelegrafContextErrorType",
  REPLY_WITH_MARKDOWN = "REPLY_WITH_MARKDOWN::TelegrafContextErrorType",
  SEND_MESSAGE = "SEND_MESSAGE::TelegrafContextErrorType",
}

export class TelegrafCtxSendMessageError extends Data.TaggedError(
  TelegrafContextErrorType.SEND_MESSAGE
)<{
  readonly args: Array<unknown>;
  readonly error: unknown;
}> {}

export class TelegrafCtxReplyWithMarkdownError extends Data.TaggedError(
  TelegrafContextErrorType.REPLY_WITH_MARKDOWN
)<{
  readonly error: unknown;
  readonly extra: Convenience.ExtraReplyMessage;
  readonly markdown: string;
}> {}
export class TelegrafCtxEditMessageTextError extends Data.TaggedError(
  TelegrafContextErrorType.EDIT_MESSAGE_TEXT
)<{
  readonly error: unknown;
  readonly extra: Convenience.ExtraEditMessageText;
  readonly markdown: string;
}> {}
