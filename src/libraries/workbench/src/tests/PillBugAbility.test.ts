import * as Bug from "../game/Bug.ts";
import * as BugNumber from "../game/BugNumber.ts";
import * as Swarm from "../game/Swarm.ts";
import * as Move from "../game/Move.ts";
import * as GameError from "../game/GameError.ts";
import * as Cell from "../game/Cell.ts";
import * as SwarmError from "../game/SwarmError.ts";
import { Either, Effect, Equal, HashMap, Option, HashSet } from "effect";
import { describe, expect, it } from "@effect/vitest";
import * as Game from "../game/Game.ts";
import * as GameStep from "../game/GameStep.ts";
import { assertRefinement, trimNewline } from "./TestUtills.ts";
import { InitialMoveDto, MoveDto, MovingMoveDto } from "../api/Move.dto.ts";
import { Coords } from "../game/Coords.ts";
import * as SwarmMember from "../game/SwarmMember.ts";
import { BeetleDto, BugDto } from "../api/Bug.dto.ts";

describe.concurrent("PillBugAbility", () => {
  it.effect(
    "pillbug ability",
    Effect.fn(function* () {
      const game = yield* Game.Init({
        pillbug: true,
      }).pipe(
        Game.moveAll({
          init: InitialMoveDto.decode("wQ1"),
          moves: [
            MovingMoveDto.decode("b: bP2 wQ1|"),
            MovingMoveDto.decode("w: wG2 |wQ1"),
            MovingMoveDto.decode("b: bQ1 bP2|"),
            MovingMoveDto.decode("w: wG2 bQ1|"),
            MovingMoveDto.decode("b: wQ1 bP2\\"),
          ],
        })
      );

      expect(Game.toString(game)).toBe(trimNewline`
№: 6
⇄: w
w: A1 A2 A3 B1 B2 G1 G3 P1 P2 S1 S2
b: A1 A2 A3 B1 B2 G1 G2 G3 P1 S1 S2
♻: Q̊ !P
       ○     ○ 

    ○     Q̊     ○     ○ 

(○)    P̲̈     Q̲̊     G̈     ○ 

    ○     ○     ○     ○ 
`);

      const gameError = yield* Game.makeMove(
        game,
        MovingMoveDto.decode("w: wQ1 |bP2")
      ).pipe(Either.flip);

      // expect(gameError).toStrictEqual(
      //   new GameError.ImpossibleMove({
      //     move: MovingMoveDto.decode("w: wQ1 |bP2"),
      //     swarmError: new SwarmError.LastMovedByPillbugViolation({
      //       move: MovingMoveDto.decode("w: wQ1 |bP2"),
      //     }),
      //     step: GameStep.GameStep(6),
      //   })
      // );

      expect(
        Equal.equals(
          gameError,
          new GameError.ImpossibleMove({
            move: MovingMoveDto.decode("w: wQ1 |bP2"),
            swarmError: new SwarmError.LastMovedByPillbugViolation({
              move: MovingMoveDto.decode("w: wQ1 |bP2"),
            }),
            step: GameStep.GameStep(6),
          })
        )
      ).toBe(true);
    })
  );

  it.effect(
    "possible moves",
    Effect.fn(function* () {
      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wP1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("bQ1"))]
        ),
        lastMoved: BugDto.decode("bQ1"),
        lastMovedByPillbug: false,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugDto.decode("bQ1")
      );

      expect(
        Swarm.toString(swarm, {
          highlight: possibleCells,
        })
      ).toBe(trimNewline`
    ○     ×     × 

 ○    (Å̲)    P̊     × 

    ○     Q̲̊     × 

       ○     ○ `);
    })
  );

  it.effect(
    "stunned pillbug",
    Effect.fn(function* () {
      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wP1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("bQ1"))]
        ),
        lastMoved: BugDto.decode("wP1"),
        lastMovedByPillbug: true,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugDto.decode("bQ1")
      );

      expect(
        Swarm.toString(swarm, {
          highlight: possibleCells,
        })
      ).toBe(trimNewline`
    ○     ○     ○ 

 ○    (Å̲)    P̊     ○ 

    ○     Q̲̊     ○ 

       ○     ○ `);
    })
  );

  it.effect(
    "stunned mosquito in touch with pillbug",
    Effect.fn(function* () {
      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bP1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wM1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("bQ1"))]
        ),
        lastMoved: BugDto.decode("wM1"),
        lastMovedByPillbug: true,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugDto.decode("bQ1")
      );

      expect(
        Swarm.toString(swarm, {
          highlight: possibleCells,
        })
      ).toBe(trimNewline`
    ○     ○     ○ 

 ○    (P̲̊)    M̊     ○ 

    ○     Q̲̊     ○ 

       ○     ○ `);
    })
  );

  it.effect(
    "mosquito not mimics with no pillbug in touch",
    Effect.fn(function* () {
      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wM1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("bQ1"))]
        ),
        lastMoved: BugDto.decode("bQ1"),
        lastMovedByPillbug: false,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugDto.decode("bQ1")
      );

      expect(
        Swarm.toString(swarm, {
          highlight: possibleCells,
        })
      ).toBe(trimNewline`
    ○     ○     ○ 

 ○    (Å̲)    M̊     ○ 

    ○     Q̲̊     ○ 

       ○     ○ `);
    })
  );
  it.effect(
    "mosquito mimics pillbug ability in touch",
    Effect.fn(function* () {
      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bP1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wM1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("bQ1"))]
        ),
        lastMoved: BugDto.decode("bQ1"),
        lastMovedByPillbug: false,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugDto.decode("bQ1")
      );

      expect(
        Swarm.toString(swarm, {
          highlight: possibleCells,
        })
      ).toBe(trimNewline`
    ○     ×     × 

 ○    (P̲̊)    M̊     × 

    ○     Q̲̊     × 

       ○     ○ `);
    })
  );

  it.effect(
    "mosquito not mimics pillbug ability in touch AND covered ",
    Effect.fn(function* () {
      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [
            Coords.Zero,
            new SwarmMember.SwarmMember({
              bug: BugDto.decode("bP1"),
              cover: [
                new Bug.Beetle({
                  number: BugNumber.One(1),
                  side: "white",
                }),
              ],
            }),
          ],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wM1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("bQ1"))]
        ),
        lastMoved: BugDto.decode("bQ1"),
        lastMovedByPillbug: false,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugDto.decode("bQ1")
      );

      expect(
        Swarm.toString(swarm, {
          highlight: possibleCells,
        })
      ).toBe(trimNewline`
    ○     ○     ○ 

 ○    (P̲̊)B̊    M̊     ○ 

    ○     Q̲̊     ○ 

       ○     ○ `);
    })
  );

  it.concurrent("Freedom to move: Pillbug can't climb", () => {
    const TestBug = () =>
      new Bug.Ladybug({
        number: BugNumber.One(1),
        side: "black",
      });

    const swarm = new Swarm.Swarm({
      lastMoved: BugDto.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Init(0.5, 1),
          SwarmMember.Init(BugDto.decode("bP2")).pipe(
            SwarmMember.addCover(
              new Bug.Mosquito({
                number: BugNumber.One(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(1.5, 1), SwarmMember.Init(TestBug())],
        [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wP1"))],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(BugDto.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("bA1"))]
      ),
    });

    // const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualEmptyCells = Swarm.pillbugAbilityMovingCells(
      swarm,
      "white",
      BugDto.decode("bL1")
    );

    const actualCoords = actualEmptyCells.pipe(
      Either.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.withBugInBasis(x, TestBug())
    );

    assertRefinement(Either.isRight, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);
    // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.right,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
    ○     ○     ○ 

 ○     P̲̈ M̊   _L̲̊_    ○ 

   (○)    P̊     P̲̊ B̊    ○ 

 ○     Å̲     ○     ○ 

    ○     ○ 
`);

    expect(actualCoords).toEqual(Either.right(HashSet.make()));
  });

  it.concurrent("Freedom to move: Mosquito can't climb", () => {
    const TestBug = () =>
      new Bug.Ladybug({
        number: BugNumber.One(1),
        side: "black",
      });

    const swarm = new Swarm.Swarm({
      lastMoved: BugDto.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Init(0.5, 1),
          SwarmMember.Init(BugDto.decode("bP2")).pipe(
            SwarmMember.addCover(
              new Bug.Mosquito({
                number: BugNumber.One(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(1.5, 1), SwarmMember.Init(TestBug())],
        [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wM1"))],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(BugDto.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("wP2"))]
      ),
    });

    // const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualEmptyCells = Swarm.pillbugAbilityMovingCells(
      swarm,
      "white",
      BugDto.decode("bL1")
    );

    const actualCoords = actualEmptyCells.pipe(
      Either.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.withBugInBasis(x, TestBug())
    );

    assertRefinement(Either.isRight, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);
    // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.right,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
    ○     ○     ○ 

 ○     P̲̈ M̊   _L̲̊_    ○ 

   (○)    M̊     P̲̊ B̊    ○ 

 ○     P̈     ○     ○ 

    ○     ○ 
`);

    expect(actualCoords).toEqual(Either.right(HashSet.make()));
  });
});
