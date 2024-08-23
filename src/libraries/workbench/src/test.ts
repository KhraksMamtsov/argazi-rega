import { Effect } from "effect";

enum Test {
  test = "test",
}

export const test = Effect.log(Test.test);
