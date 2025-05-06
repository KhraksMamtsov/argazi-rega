import * as Bug from "../domain/Bug.js";
import * as BugNumber from "../domain/BugNumber.js";
import * as Swarm from "../domain/Swarm.js";
import * as GameError from "../domain/GameError.js";
import * as Cell from "../domain/Cell.js";
import * as SwarmError from "../domain/SwarmError.js";
import { Either, Effect, Equal, HashMap, Option, HashSet } from "effect";
import { describe, expect, it } from "@effect/vitest";
import * as Game from "../domain/Game.js";
import * as GameStep from "../domain/GameStep.js";
import { assertRefinement, trimNewline } from "./TestUtills.js";
import { InitialGameMoveStr, BugGameMoveStr } from "../api/GameMove.str.js";
import { Coords } from "../domain/Coords.js";
import * as SwarmMember from "../domain/SwarmMember.js";
import { BugStr } from "../api/Bug.str.js";

describe.concurrent("PillBugAbility", () => {
  it.effect(
    "pillbug ability",
    Effect.fn(function* () {
      const game = yield* Game.Init({
        ladybug: false,
        mosquito: false,

        pillbug: true,
      }).pipe(
        Game.moveAll({
          init: InitialGameMoveStr.decode("wQ1"),
          moves: [
            BugGameMoveStr.decode("b: bP1 wQ1|"),
            BugGameMoveStr.decode("w: wG2 |wQ1"),
            BugGameMoveStr.decode("b: bQ1 bP1|"),
            BugGameMoveStr.decode("w: wG2 bQ1|"),
            BugGameMoveStr.decode("b: wQ1 bP1\\"),
          ],
        })
      );

      expect(Game.toString(game)).toBe(trimNewline`
№: 6
⇄: w
w: A1 A2 A3 B1 B2 G1 G3 P1 S1 S2
b: A1 A2 A3 B1 B2 G1 G2 G3 S1 S2
♻: Q̊ !P
       ○     ○ 

    ○     Q̊     ○     ○ 

(○)    P̲̊     Q̲̊     G̈     ○ 

    ○     ○     ○     ○ 
`);

      const gameError = yield* Game.makeMove(
        game,
        BugGameMoveStr.decode("w: wQ1 |bP1")
      ).pipe(Either.flip);

      // expect(gameError).toStrictEqual(
      //   new GameError.ImpossibleMove({
      //     move: MovingMoveDto.decode("w: wQ1 |bP1"),
      //     swarmError: new SwarmError.LastMovedByPillbugViolation({
      //       move: MovingMoveDto.decode("w: wQ1 |bP1"),
      //     }),
      //     step: GameStep.GameStep(6),
      //   })
      // );

      expect(
        Equal.equals(
          gameError,
          new GameError.ImpossibleMove({
            move: BugGameMoveStr.decode("w: wQ1 |bP1"),
            swarmError: new SwarmError.LastMovedByPillbugViolation({
              move: BugGameMoveStr.decode("w: wQ1 |bP1"),
            }),
            step: GameStep.GameStep.make(6),
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
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wP1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("bQ1"))]
        ),
        lastMoved: BugStr.decode("bQ1"),
        lastMovedByPillbug: false,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugStr.decode("bQ1")
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
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wP1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("bQ1"))]
        ),
        lastMoved: BugStr.decode("wP1"),
        lastMovedByPillbug: true,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugStr.decode("bQ1")
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
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bP1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wM1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("bQ1"))]
        ),
        lastMoved: BugStr.decode("wM1"),
        lastMovedByPillbug: true,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugStr.decode("bQ1")
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
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wM1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("bQ1"))]
        ),
        lastMoved: BugStr.decode("bQ1"),
        lastMovedByPillbug: false,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugStr.decode("bQ1")
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
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bP1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wM1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("bQ1"))]
        ),
        lastMoved: BugStr.decode("bQ1"),
        lastMovedByPillbug: false,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugStr.decode("bQ1")
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
              bug: BugStr.decode("bP1"),
              cover: [
                new Bug.Beetle({
                  number: BugNumber.One.make(1),
                  side: "white",
                }),
              ],
            }),
          ],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wM1"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("bQ1"))]
        ),
        lastMoved: BugStr.decode("bQ1"),
        lastMovedByPillbug: false,
      });

      const possibleCells = yield* Swarm.pillbugAbilityMovingCells(
        swarm,
        "white",
        BugStr.decode("bQ1")
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
        number: BugNumber.One.make(1),
        side: "black",
      });

    const swarm = new Swarm.Swarm({
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Init(0.5, 1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Mosquito({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(1.5, 1), SwarmMember.Init(TestBug())],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wP1"))],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("bA1"))]
      ),
    });

    // const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualEmptyCells = Swarm.pillbugAbilityMovingCells(
      swarm,
      "white",
      BugStr.decode("bL1")
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

 ○     P̲̊ M̊   _L̲̊_    ○ 

   (○)    P̊     P̲̊ B̊    ○ 

 ○     Å̲     ○     ○ 

    ○     ○ 
`);

    expect(actualCoords).toEqual(Either.right(HashSet.make()));
  });

  it.concurrent("Freedom to move: Pillbug can't descend", () => {
    const TestBug = () =>
      new Bug.Ladybug({
        number: BugNumber.One.make(1),
        side: "black",
      });

    const swarm = new Swarm.Swarm({
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Init(0.5, 1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Mosquito({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wP1"))],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())]
      ),
    });

    // const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualEmptyCells = Swarm.pillbugAbilityMovingCells(
      swarm,
      "white",
      TestBug()
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
    ○     ○ 

 ○     P̲̊ M̊    ○     ○ 

   (×)    P̊     P̲̊ B̊    ○ 

 ○    _L̲̊_    ×     ○ 

    ○     ○ 
`);

    expect(actualCoords).toEqual(
      Either.right(HashSet.make(Coords.Zero, Coords.Init(1.5, -1)))
    );
  });

  it.concurrent("Freedom to move: Pillbug can't descend", () => {
    const TestBug = () =>
      new Bug.Pillbug({
        number: BugNumber.One.make(1),
        side: "white",
      });

    const swarm = new Swarm.Swarm({
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Init(0.5, 1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Mosquito({
                number: BugNumber.One.make(1),
                side: "black",
              })
            )
          ),
        ],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wM1"))],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())]
      ),
    });

    // const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualEmptyCells = Swarm.pillbugAbilityMovingCells(
      swarm,
      "white",
      TestBug()
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
    ○     ○ 

 ○     P̲̊ M̲̊    ○     ○ 

   (×)    M̊     P̲̊ B̊    ○ 

 ○    _P̊_    ×     ○ 

    ○     ○ 
`);

    expect(actualCoords).toEqual(
      Either.right(HashSet.make(Coords.Zero, Coords.Init(1.5, -1)))
    );
  });

  it.concurrent("Freedom to move: Mosquito can't climb", () => {
    const TestBug = () =>
      new Bug.Ladybug({
        number: BugNumber.One.make(1),
        side: "black",
      });

    const swarm = new Swarm.Swarm({
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Init(0.5, 1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Mosquito({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(1.5, 1), SwarmMember.Init(TestBug())],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wM1"))],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("wP1"))]
      ),
    });

    // const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualEmptyCells = Swarm.pillbugAbilityMovingCells(
      swarm,
      "white",
      BugStr.decode("bL1")
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

 ○     P̲̊ M̊   _L̲̊_    ○ 

   (○)    M̊     P̲̊ B̊    ○ 

 ○     P̊     ○     ○ 

    ○     ○ 
`);

    expect(actualCoords).toEqual(Either.right(HashSet.make()));
  });
});
