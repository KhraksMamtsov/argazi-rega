import { Data, Array, Either, Match, Pipeable, Option, HashSet } from "effect";
import * as Hand from "./Hand.ts";
import * as Side from "./Side.ts";
import * as Move from "./GameMove.ts";
import * as Bug from "./Bug.ts";
import * as GameStep from "./GameStep.ts";
import { distributive } from "../shared/effect/Types.ts";
import { QueenBeeState } from "./QueenBeeState.ts";
import { Finish } from "./Finish.ts";
import * as Cell from "./Cell.ts";
import * as Swarm from "./Swarm.ts";
import * as GameError from "./GameError.ts";
import { dual } from "effect/Function";

export interface GameInProgress extends Pipeable.Pipeable {}
export class GameInProgress extends Data.TaggedClass("GameInProgress")<{
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

export type Game = GameInProgress | InitGame;

export const Init = (option: {
  mosquito: boolean;
  pillbug: boolean;
  ladybug: boolean;
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
    initialMove: Move.InitialGameMove
  ): (
    game: InitGame
  ) => Either.Either<
    GameInProgress,
    GameError.ForbiddenInitialMove | GameError.Absurd
  >;
  (
    game: InitGame,
    initialMove: Move.InitialGameMove
  ): Either.Either<GameInProgress, GameError.WrongSideMove | GameError.Absurd>;
} = dual(2, (game: InitGame, initialMove: Move.InitialGameMove) => {
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
          new GameInProgress({
            white,
            black,
            swarm: Swarm.Init(x),
            step: GameStep.next(game.step),
          })
      )
    );
});

export const validateFinish = (game: GameInProgress) =>
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

export const skipTurnIfNeeded = (game: GameInProgress) => {
  const currentSide_ = currentSide(game.step);

  const possibleMoves = Swarm.possibleMoves(currentSide_)(game.swarm);
  const noPossibleMoves = HashSet.size(possibleMoves) === 0;
  const hasIntroducibleCells = Swarm.hasIntroducibleCells(currentSide_)(
    game.swarm
  );
  const handIsEmpty = Hand.isEmpty(game[Side.opposite(currentSide_)]);

  const canNotIntroduce =
    handIsEmpty || (!handIsEmpty && !hasIntroducibleCells);

  if (canNotIntroduce && noPossibleMoves) {
    return new GameInProgress({
      black: game.black,
      swarm: game.swarm,
      white: game.white,
      step: GameStep.next(game.step),
    });
  } else {
    return game;
  }
};

export const makeMove: {
  (
    game: GameInProgress,
    move: Move.BugGameMove
  ): Either.Either<GameInProgress, GameError.GameError | Finish>;
  (
    move: Move.BugGameMove
  ): (
    game: GameInProgress
  ) => Either.Either<GameInProgress, GameError.GameError | Finish>;
} = dual(2, (game: GameInProgress, move: Move.BugGameMove) =>
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
      Option.isNone(Swarm.findCellWithBug(game.swarm, move.bug))
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
        const [, white] = Hand.extractBug(game.white, move.bug);
        const [, black] = Hand.extractBug(game.black, move.bug);
        return new GameInProgress({
          step: GameStep.next(game.step),
          white,
          black,
          swarm: newSwarm,
        });
      })
    );

    const unfinishedGame = yield* validateFinish(afterMoveGame);

    return skipTurnIfNeeded(unfinishedGame);
  })
);

export const moveAll =
  (options: {
    init: Move.InitialGameMove;
    moves: Iterable<Move.BugGameMove>;
  }) =>
  (game: InitGame) =>
    Array.reduce(
      options.moves,
      makeInitialMove(game, options.init) as Either.Either<
        GameInProgress,
        MoveResult
      >,
      (gameState, currentMove) =>
        gameState.pipe(Either.flatMap(makeMove(currentMove)))
    );

const G = Data.taggedEnum<Game>();

export const toString = (game: Game) =>
  G.$match(game, {
    InitGame: () => "...",
    GameInProgress: (game) =>
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
