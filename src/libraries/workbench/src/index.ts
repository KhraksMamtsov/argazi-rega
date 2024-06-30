import { Data, Effect, Match } from "effect";

export type StreamEvent = Data.TaggedEnum<{
  ContentStart: { readonly content: string };
  Content: { readonly content: string };
  Message: { readonly message: "AssistantMessage" };
  InvalidFunctionCall: {
    readonly id: string;
    readonly name: string;
    readonly arguments: string;
  };
  FunctionCallStart: { readonly id: string; readonly name: string };
  FunctionCall: {
    readonly id: string;
    readonly name: string;
    readonly arguments: string;
  };
}>;
export const StreamEvent = Data.taggedEnum<StreamEvent>();

const handleFunctionCall = (
  event: Data.TaggedEnum.Value<StreamEvent, "FunctionCall">
) => Effect.succeed("event" as const);

const onStreamEvent = Match.type<StreamEvent>().pipe(
  Match.tag("FunctionCall", (x) => handleFunctionCall(x)),
  Match.orElse((event) => Effect.succeed("event" as const))
);
