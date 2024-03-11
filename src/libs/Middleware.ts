// import { Context, Effect, Option, pipe, Random } from "effect";
//
// type Fn<in In, out Out> = (_in: In) => Out;
//
// // (_in: In) => (next: (nIn: nOut) => Effect<nIn>) => Effect<Out>;
// type Middleware<
//   in In,
//   out OutR,
//   out OutE,
//   out Out,
//   out NextIn,
//   in NextOutR,
//   in NextOutE,
//   in NextOut,
// > = Fn<
//   In,
//   Fn<
//     Fn<NextIn, Effect.Effect<NextOutR, NextOutE, NextOut>>,
//     Effect.Effect<OutR, OutE, Out>
//   >
// >;
//
// export const identity =
//   <T>(): Middleware<T, never, never, T, T, never, never, T> =>
//   (x) =>
//   (next) =>
//     next(x);
//
// export const effect =
//   <In, OutR, OutE, Out, Next>(
//     middleware: Middleware<In, OutR, OutE, Out, Next, never, never, Next>,
//   ) =>
//   (_in: In) =>
//     middleware(_in)(Effect.succeed);
//
// const contraMap =
//   <In1, In>(fn: (x: In1) => In) =>
//   <
//     OutR,
//     OutE,
//     Out,
//     //next
//     NextIn,
//     NextOutR,
//     NextOutE,
//     NextOut,
//   >(
//     mw: Middleware<In, OutR, OutE, Out, NextIn, NextOutR, NextOutE, NextOut>,
//   ): Middleware<In1, OutR, OutE, Out, NextIn, NextOutR, NextOutE, NextOut> =>
//   (_in) =>
//     mw(fn(_in));
//
// const map =
//   <OutA, OutB>(fn: (out: OutA) => OutB) =>
//   <In, OutRA, OutEA, NextIn, NextOutR, NextOutE, NextOut>(
//     mw: Middleware<In, OutRA, OutEA, OutA, NextIn, NextOutR, NextOutE, NextOut>,
//   ): Middleware<In, OutRA, OutEA, OutB, NextIn, NextOutR, NextOutE, NextOut> =>
//   (_in) =>
//   (next) =>
//     Effect.map(mw(_in)(next), fn);
//
// const flatMap =
//   <OutA, OutB, OutRB, OutEB>(
//     fn: (out: OutA) => Effect.Effect<OutRB, OutEB, OutB>,
//   ) =>
//   <In, OutRA, OutEA, NextIn, NextOutR, NextOutE, NextOut>(
//     mw: Middleware<In, OutRA, OutEA, OutA, NextIn, NextOutR, NextOutE, NextOut>,
//   ): Middleware<
//     In,
//     OutRA | OutRB,
//     OutEA | OutEB,
//     OutB,
//     NextIn,
//     NextOutR,
//     NextOutE,
//     NextOut
//   > =>
//   (_in) =>
//   (next) =>
//     Effect.flatMap(mw(_in)(next), fn);
//
// const asd22 = Effect.Tag<11, { asd: 2 }>();
//
// const asd =
//     (income: number) =>
//   (next: (x: number) => Effect.Effect<never, never, 3>) =>
//     Effect.gen(function* (_) {
//       if (income > 3) {
//         const fromNext = yield* _(next(income));
//
//         return fromNext;
//       } else {
//         return "xx";
//       }
//     });
//
// const qwe = pipe(
//   //
//     asd,
//   // identity(),
//   contraMap((_s: 3) => 2 as const),
//   // map((x) => `${x}`),
//   // flatMap((x) =>
//   //   Effect.gen(function* (_) {
//   //     yield* _(asd22);
//   //     const randomNumber = yield* _(
//   //       Random.next,
//   //       Effect.flatMap(Option.liftPredicate((x) => x > 2)),
//   //     );
//   //     if (x === "") {
//   //       return randomNumber;
//   //     } else {
//   //       return [1, 1] as const;
//   //     }
//   //   }),
//   // ),
//   // effect,
//   // (x) => (next: (s: any) => Effect.Effect<any, any, any>) =>
//   //   Effect.gen(function* (_) {
//   //     if(x)
//   //   }),
// );
