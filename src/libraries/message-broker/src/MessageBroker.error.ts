import { Record, Data } from "effect";

enum AMQPErrorTag {
  ACK = "ACK::AMQPErrorTag",
  ASSERT_QUEUE = "ASSERT_QUEUE::AMQPErrorTag",
  CONNECT = "CONNECT::AMQPErrorTag",
  CONSUME = "CONSUME::AMQPErrorTag",
  CREATE_CHANNEL = "CREATE_CHANNEL::AMQPErrorTag",
  SEND_TO_QUEUE = "SEND_TO_QUEUE::AMQPErrorTag",
}

export class ConnectError extends Data.TaggedError(AMQPErrorTag.CONNECT)<{
  readonly cause: unknown;
  readonly config: Record.ReadonlyRecord<string, string>;
}> {}
export class AckError extends Data.TaggedError(AMQPErrorTag.ACK)<{
  readonly cause: unknown;
}> {}
export class CreateChannelError extends Data.TaggedError(
  AMQPErrorTag.CREATE_CHANNEL
)<{
  readonly cause: unknown;
}> {}
export class AssertQueueError extends Data.TaggedError(
  AMQPErrorTag.ASSERT_QUEUE
)<{
  readonly cause: unknown;
}> {}
export class SendToQueueError extends Data.TaggedError(
  AMQPErrorTag.SEND_TO_QUEUE
)<{
  readonly cause: unknown;
}> {}
