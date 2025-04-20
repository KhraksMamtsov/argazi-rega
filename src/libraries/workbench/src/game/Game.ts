import {
  Data,
  Array,
  Either,
  Match,
  Unify,
  Pipeable,
  Effect,
  Option,
} from "effect";
import * as Hand from "./Hand.ts";
import * as Side from "./Side.ts";
import * as Move from "./Move.ts";
import * as Bug from "./Bug.ts";
import * as GameStep from "./GameStep.ts";
import { distributive } from "../shared/effect/Types.ts";
import { QueenBeeState } from "./QueenBeeState.ts";
import { Finish } from "./Finish.ts";
import * as Cell from "./Cell.ts";
import * as Swarm from "./Swarm.ts";
import * as GameError from "./GameError.ts";
import { dual } from "effect/Function";

export interface Game extends Pipeable.Pipeable {}
export class Game extends Data.TaggedClass("Game")<{
  step: GameStep.GameStep;
  swarm: Swarm.Swarm;
  black: Hand.Hand;
  white: Hand.Hand;
}> {
  static {
    this.prototype.pipe = function () {
      return Pipeable.pipeArguments(this, arguments);
    };
  }
}

export interface InitGame extends Pipeable.Pipeable {}
export class InitGame extends Data.TaggedClass("InitGame")<{
  step: GameStep.GameStep;
  black: Hand.Hand;
  white: Hand.Hand;
}> {
  static {
    this.prototype.pipe = function () {
      return Pipeable.pipeArguments(this, arguments);
    };
  }
}

export const Init = (option?: {
  mosquito?: boolean;
  pillbug?: boolean;
  ladybug?: boolean;
}) =>
  new InitGame({
    step: GameStep.Init(),
    black: Hand.Init("black", option),
    white: Hand.Init("white", option),
  });

export const currentSide = (step: GameStep.GameStep): Side.Side =>
  step % 2 === 0 ? "white" : "black";

export type MoveResult = Either.Either.Left<
  ReturnType<ReturnType<typeof makeMove>>
>;

const makeInitialMove: {
  (
    initialMove: Move.InitialMove
  ): (
    game: InitGame
  ) => Either.Either<Game, GameError.ForbiddenInitialMove | GameError.Absurd>;
  (
    game: InitGame,
    initialMove: Move.InitialMove
  ): Either.Either<Game, GameError.WrongSideMove | GameError.Absurd>;
} = dual(2, (game: InitGame, initialMove: Move.InitialMove) => {
  if (currentSide(game.step) !== initialMove.bug.side) {
    return Either.left(
      new GameError.WrongSideMove({ move: initialMove, step: game.step })
    );
  }
  const [_extractedWhiteBug, white] = Hand.extractBug(
    game.white,
    initialMove.bug
  );
  const [_extractedBlackBug, black] = Hand.extractBug(
    game.black,
    initialMove.bug
  );

  return Match.value(distributive([_extractedWhiteBug, _extractedBlackBug]))
    .pipe(
      Match.when([Option.isSome, Option.isNone], ([white, _black]) =>
        Either.right(white.value)
      ),
      Match.when([Option.isNone, Option.isSome], ([_white, black]) =>
        Either.right(black.value)
      ),
      Match.orElse(() =>
        Either.left(
          new GameError.Absurd({
            move: initialMove,
            step: game.step,
          })
        )
      )
    )
    .pipe(
      Either.map(
        (x) =>
          new Game({
            white,
            black,
            swarm: Swarm.Init(x),
            step: GameStep.next(game.step),
          })
      )
    );
});

export const validateFinish = (game: Game) =>
  QueenBeeState.$match(Swarm.queenBeesState(game.swarm), {
    BothSurrounded: () => Either.left(Finish.Draw({ step: game.step })),
    OneSurrounded: (x) =>
      Either.left(
        Finish.Win({
          step: game.step,
          side: Side.opposite(Cell.bugInBasis(x.cell).side),
        })
      ),
    Free: () => Either.right(game),
  });

export const validateSkip = (game: Game) => {
  const currentSide_ = currentSide(game.step);
  // if (Hand.isEmpty(game[Side.opposite(currentSide_)])) {
  // }
};

export const makeMove: {
  (
    game: Game,
    move: Move.MovingMove
  ): Either.Either<Game, GameError.GameError | Finish>;
  (
    move: Move.MovingMove
  ): (game: Game) => Either.Either<Game, GameError.GameError | Finish>;
} = dual(2, (game: Game, move: Move.MovingMove) =>
  Either.gen(function* () {
    const moveSide = Move.side(move);
    const gameCurrentSide = currentSide(game.step);
    if (gameCurrentSide !== moveSide) {
      return yield* Either.left(
        new GameError.WrongSideMove({ move, step: game.step })
      );
    }

    if (
      game.step >= GameStep.QueenPlacementViolationStep &&
      Move.isNotQueenMove(move)
    ) {
      return yield* Either.left(
        new GameError.QueenPlacementViolation({ move, step: game.step })
      );
    }

    if (
      !Hand.containsBug(game[moveSide], move.bug) &&
      Option.isNone(Swarm.findBug(game.swarm, move.bug))
    ) {
      return yield* Either.left(
        new GameError.BugNotFound({ move, step: game.step })
      );
    }

    const afterMoveGame = yield* Swarm.move(game.swarm, move).pipe(
      Either.mapLeft(
        (swarmError) =>
          new GameError.ImpossibleMove({
            swarmError,
            move,
            step: game.step,
          })
      ),
      Either.map((newSwarm) => {
        const [_extractedWhiteBug, white] = Hand.extractBug(
          game.white,
          move.bug
        );
        const [_extractedBlackBug, black] = Hand.extractBug(
          game.black,
          move.bug
        );
        return new Game({
          step: GameStep.next(game.step),
          white,
          black,
          swarm: newSwarm,
        });
      })
    );

    return yield* validateFinish(afterMoveGame);
  })
);

export const moveAll =
  (options: { init: Move.InitialMove; moves: Iterable<Move.MovingMove> }) =>
  (game: InitGame) =>
    Array.reduce(
      options.moves,
      makeInitialMove(game, options.init) as Either.Either<Game, MoveResult>,
      (gameState, currentMove) =>
        gameState.pipe(Either.flatMap(makeMove(currentMove)))
    );

const G = Data.taggedEnum<InitGame | Game>();

export const toString = (game: InitGame | Game) =>
  G.$match(game, {
    InitGame: () => "...",
    Game: (game) =>
      [
        "№: " + game.step,
        "⇄: " + Side.toString(currentSide(game.step)),
        Hand.toString(game.white),
        Hand.toString(game.black),
        "♻: " +
          Bug.symbol(game.swarm.lastMoved) +
          (game.swarm.lastMovedByPillbug ? " !P" : ""),
        Swarm.toString(game.swarm),
      ].join("\n"),
  });
