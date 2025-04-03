import { Data } from "effect";
import { Side } from "./Side.ts";
import * as GameStep from "./GameStep.ts";

export class Win extends Data.TaggedClass("Win")<{ side: Side }> {}
export class Draw extends Data.TaggedClass("Draw") {}

export type Result = Win | Draw;
export const Result = Data.taggedEnum<Result>();

export class Finish extends Data.TaggedClass("Finish")<{
  result: Result;
  step: GameStep.GameStep;
}> {
  static Draw = (options: { step: GameStep.GameStep }) =>
    new Finish({ result: new Draw(), step: options.step });
  static Win = (options: { side: Side; step: GameStep.GameStep }) =>
    new Finish({ result: new Win({ side: options.side }), step: options.step });
}
