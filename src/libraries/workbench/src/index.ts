import { Effect, Logger } from "effect";
// import { test } from "./test.ts"; // *.ts
import { test } from "./test.ts";

void test.pipe(
  //
  Effect.provide(Logger.pretty),
  Effect.runPromise
);
