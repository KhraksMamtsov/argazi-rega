import { Data, Effect, Layer, pipe, Schedule, Secret, Fiber } from "effect";
import * as _Telegraf from "telegraf";
import { useNewReplies } from "telegraf/future";

import * as TelegrafBot from "./TelegrafBot.js";
import * as TC from "./TelegrafConfig.js";
import * as TO from "./TelegrafOptionsTag.js";

export enum ErrorType {
	INIT = "INIT::TelegrafErrorType",
	LAUNCH = "LAUNCH::TelegrafErrorType",
}

export class TelegrafInitError extends Data.TaggedError(ErrorType.INIT)<{
	readonly cause: unknown;
	readonly options: TO.TelegrafOptions;
}> {}
export class TelegrafLaunchError extends Data.TaggedError(ErrorType.LAUNCH)<{
	readonly cause: unknown;
}> {}

const makeLive = pipe(
	{
		options: TO.TelegrafOptionsTag,
		telegrafConfig: TC.TelegrafConfig,
	} as const,
	Effect.all,
	Effect.map(({ options, telegrafConfig }) => {
		const init = () =>
			pipe(
				Effect.try({
					catch: (cause) => new TelegrafInitError({ cause, options }),
					try: () =>
						new _Telegraf.Telegraf(Secret.value(telegrafConfig), options),
				}),
				Effect.acquireRelease((x) =>
					Effect.succeed(() => {
						x.stop();
					})
				),
				Effect.tryMap({
					catch: (cause) => new TelegrafInitError({ cause, options }),
					try: (x) => x.use(useNewReplies()),
				}),
				Effect.map((x) => ({
					bot: TelegrafBot.makeBot(x),
					launch: launch(x),
				}))
			);

		const launch =
			(bot: TelegrafBot.Bot) =>
			<R, E, A>(effect: Effect.Effect<A, E, R>) =>
				Effect.gen(function* (_) {
					const effectFiber = yield* _(Effect.fork(effect));

					yield* _(
						Effect.tryPromise({
							catch: (cause) => new TelegrafLaunchError({ cause }),
							try: () => {
								console.log("launching");
								return bot.launch();
							},
						}),
						Effect.tapError((x) => {
							console.dir(x);
							return Effect.logError(x);
						})
					);

					yield* _(Fiber.join(effectFiber));
				}).pipe(
					Effect.tapBoth({ onFailure: Effect.log, onSuccess: Effect.log }),
					Effect.retry(Schedule.exponential("1 seconds", 2))
				);

		// return pipe(
		//   Effect.runPromiseExit(effect),
		//   (x) => {
		//     x.then(
		//       Exit.match({
		//         onFailure: (x) => {
		//           console.log("launch exit onFailure", x._tag);
		//           console.dir(x, { depth: 1000 });
		//         },
		//         onSuccess: () => {
		//           console.log("launch exit onSuccess");
		//         },
		//       }),
		//     );
		//   },
		//   () =>
		//     Effect.tryPromise({
		//       try: () => {
		//         console.log("launching");
		//         return bot.launch();
		//       },
		//       catch: (cause) => new TelegrafLaunchError({ cause }),
		//     }),
		//   Effect.retry(Schedule.exponential("1 seconds", 2)),
		// );

		return { init } as const;
	})
);

export interface Telegraf {
	readonly _: unique symbol;
}
export type TelegrafService = Effect.Effect.Success<typeof makeLive>;

export class TelegrafTag extends Effect.Tag("@telegraf/Telegraf")<
	Telegraf,
	TelegrafService
>() {
	public static readonly Live = Layer.effect(this, makeLive);
}
