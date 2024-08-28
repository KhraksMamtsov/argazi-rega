import { Data, Array, pipe } from "effect";
import * as Hive from "./Hive.ts";
import * as Reserve from "./Reserve.ts";
import * as Cell from "./Cell.ts";
import { Side } from "./Side.ts";
import * as Move from "./Move.ts";

export class Game extends Data.TaggedClass("Game")<{
  step: number;
  hive: Hive.Hive;
  black: Reserve.Reserve;
  white: Reserve.Reserve;
}> {}

export const getCurrentSide = (step: number) =>
  step % 2 === 0 ? Side.White : Side.Black;

// export function getPossibleMovements(game: Game) {
//   const currentSide = getCurrentSide(game.step);

//   return {
//     introduceCells: introduceCells(currentSide)(game),
//   };
// }

export const move =
  (move: Move.Move) =>
  (game: Game): Game => {};
