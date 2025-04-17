import { Data, Array, Either, Match, Unify, Pipeable } from "effect";
import * as Hand from "./Hand.ts";
import * as Side from "./Side.ts";
import * as Move from "./Move.ts";
import * as GameStep from "./GameStep.ts";
import { distributive } from "../shared/effect/Types.ts";
import { QueenBeeState } from "./QueenBeeState.ts";
import { Finish } from "./Finish.ts";
import * as Cell from "./Cell.ts";
import * as Swarm from "./Swarm.ts";
import * as GameError from "./GameError.ts";
import { dual } from "effect/Function";

export interface Game extends Pipeable.Pipeable {}
export class Game extends Data.Class<{
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

export const Init = () =>
  new Game({
    step: GameStep.Init(),
    black: Hand.Init("black"),
    white: Hand.Init("white"),
    swarm: Swarm.Empty(),
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
    game: Game
  ) => Either.Either<Game, GameError.ForbiddenInitialMove | GameError.Absurd>;
  (
    game: Game,
    initialMove: Move.InitialMove
  ): Either.Either<Game, GameError.ForbiddenInitialMove | GameError.Absurd>;
} = dual(2, (game: Game, initialMove: Move.InitialMove) => {
  if (!GameStep.isInitialStep(game.step)) {
    return Either.left(
      new GameError.ForbiddenInitialMove({
        move: initialMove,
        step: game.step,
      })
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
      Match.when([{ _tag: "Some" }, { _tag: "None" }], ([white, _black]) =>
        Either.right(white.value)
      ),
      Match.when([{ _tag: "None" }, { _tag: "Some" }], ([_white, black]) =>
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
    move: Move.Move
  ): Either.Either<Game, GameError.GameError | Finish>;
  (
    move: Move.Move
  ): (game: Game) => Either.Either<Game, GameError.GameError | Finish>;
} = dual(2, (game: Game, move: Move.Move) =>
  Either.gen(function* () {
    const moveSide = Move.side(move);
    if (currentSide(game.step) !== moveSide) {
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

    const afterMoveGame = yield* Move.Move.$match(move, {
      InitialMove: (x) => makeInitialMove(game, x),
      BugMove: (movingMove) =>
        Swarm.move(game.swarm, movingMove).pipe(
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
              movingMove.bug
            );
            const [_extractedBlackBug, black] = Hand.extractBug(
              game.black,
              movingMove.bug
            );
            return new Game({
              step: GameStep.next(game.step),
              white,
              black,
              swarm: newSwarm,
            });
          })
        ),
    });

    return yield* validateFinish(afterMoveGame);
  })
);

export const moveAll = (moves: Iterable<Move.Move>) => (game: Game) =>
  Array.reduce(
    moves,
    Either.right(game) as Either.Either<Game, MoveResult>,
    (gameState, currentMove) =>
      gameState.pipe(Either.flatMap(makeMove(currentMove)))
  );
