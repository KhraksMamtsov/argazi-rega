import { Effect, Ref } from "effect";

const doWork = (options: {
  //
  delay: number;
  result: number;
  ref: Ref.Ref<Array<number>>;
}) =>
  Effect.sleep(options.delay).pipe(
    Effect.andThen(
      Ref.update(options.ref, (value) => {
        value.push(options.result);
        return value;
      })
    )
  );

let delayStart = 0;
function getDelayHappy() {
  const oldDelay = delayStart;
  delayStart += 100;
  return oldDelay;
}

function getDelayRealLife() {
  return Math.random() * 100;
}

const buggyProgramm = Effect.gen(function* () {
  const resultRef = yield* Ref.make<Array<number>>([]);

  yield* Effect.all(
    [
      doWork({ ref: resultRef, result: 1, delay: getDelayHappy() }),
      doWork({ ref: resultRef, result: 2, delay: getDelayHappy() }),
      doWork({ ref: resultRef, result: 3, delay: getDelayHappy() }),
    ],
    { concurrency: "unbounded" }
  );

  const result = yield* Ref.get(resultRef);

  yield* Effect.log(result);
});

buggyProgramm.pipe(Effect.runPromise);
