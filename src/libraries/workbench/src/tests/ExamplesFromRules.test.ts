import * as Bug from "../domain/Bug.js";
import * as BugNumber from "../domain/BugNumber.js";
import * as Swarm from "../domain/Swarm.js";
import { HashMap, Option, Equal, Either, HashSet } from "effect";
import * as SwarmMember from "../domain/SwarmMember.js";
import { Coords } from "../domain/Coords.js";
import { test, describe, expect } from "@effect/vitest";

import * as Cell from "../domain/Cell.js";
import { BugStr } from "../api/Bug.str.js";
import { assertRefinement, trimNewline } from "./TestUtills.js";

describe.concurrent("Examples from rules", () => {
  test.concurrent("QueenBee", () => {
    const BlackQueenBee = () => BugStr.decode("bQ1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bA1"),
      field: HashMap.make(
        [Coords.Init(1, 2), SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(2, 2), SwarmMember.Init(BugStr.decode("wS1"))],
        [Coords.Init(2.5, 1), SwarmMember.Init(BugStr.decode("bS1"))],
        [Coords.Init(0.5, 1), SwarmMember.Init(BlackQueenBee())],
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bG1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wQ1"))],
        [Coords.Init(3, 0), SwarmMember.Init(BugStr.decode("bB1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("wG1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugStr.decode("wB1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, BlackQueenBee());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(
      HashSet.every(Cell.refine("Empty")),
      actualEmptyCells.value
    );

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(1.5, 1),
          Coords.Init(1, 0),
          Coords.Init(-0.5, 1),
          Coords.Init(0, 2)
        )
      )
    );
  });

  test.concurrent("Pillbug", () => {
    const WhitePillbug = () => BugStr.decode("wP1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bA1"),
      field: HashMap.make(
        [Coords.Init(1.5, 1), SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(2.5, 1), SwarmMember.Init(BugStr.decode("wQ1"))],
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bB1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wS1"))],
        [Coords.Init(2, 0), SwarmMember.Init(WhitePillbug())],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugStr.decode("bQ1"))]
      ),
    });

    const testPillbug = Cell.findFirstOccupied(
      swarm.graph,
      Cell.withBugInBasis(WhitePillbug())
    );
    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, WhitePillbug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testPillbug);
    assertRefinement(
      HashSet.every(Cell.refine("Empty")),
      actualEmptyCells.value
    );

    expect(actualCoords).toEqual(
      Option.some(HashSet.make(Coords.Init(3, 0), Coords.Init(2.5, -1)))
    );
  });

  test.concurrent("Beetle", () => {
    const WhiteBeetle = () => BugStr.decode("wB1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bA1"),
      field: HashMap.make(
        [Coords.Init(0.5, 1), SwarmMember.Init(BugStr.decode("wS1"))],
        [Coords.Init(1.5, 1), SwarmMember.Init(WhiteBeetle())],
        [Coords.Zero, SwarmMember.Init(BugStr.decode("wQ1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugStr.decode("bQ1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugStr.decode("bG1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, WhiteBeetle());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetle = Cell.findFirstOccupied(
      swarm.graph,
      Cell.withBugInBasis(WhiteBeetle())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetle);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(2.5, 1),
          Coords.Init(0.5, 1),
          Coords.Init(2, 0),
          Coords.Init(1, 2)
        )
      )
    );
  });

  test.concurrent("Grasshopper", () => {
    const WhiteGrasshopper = () => BugStr.decode("wG1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bA1"),
      field: HashMap.make(
        [Coords.Init(0.5, 1), SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(1.5, 1), SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bQ1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wS1"))],
        [Coords.Init(3, 0), SwarmMember.Init(BugStr.decode("bB1"))],
        [Coords.Init(4, 0), SwarmMember.Init(BugStr.decode("bS1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(WhiteGrasshopper())],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugStr.decode("bG1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugStr.decode("wQ1"))],
        [Coords.Init(4.5, -1), SwarmMember.Init(BugStr.decode("wS2"))],
        [Coords.Init(1, -2), SwarmMember.Init(BugStr.decode("wB1"))],
        [Coords.Init(4, -2), SwarmMember.Init(BugStr.decode("bS2"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(
      swarm,
      WhiteGrasshopper()
    );
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    assertRefinement(Option.isSome, actualEmptyCells);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(-0.5, 1),
          Coords.Init(1.5, -3),
          Coords.Init(3.5, -1)
        )
      )
    );
  });

  test.concurrent("Spider", () => {
    const BlackSpider = () => BugStr.decode("bS1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bA1"),
      field: HashMap.make(
        [Coords.Init(2.5, 3), SwarmMember.Init(BlackSpider())],
        [Coords.Init(1, 2), SwarmMember.Init(BugStr.decode("wB1"))],
        [Coords.Init(3, 2), SwarmMember.Init(BugStr.decode("wS1"))],
        //
        [Coords.Init(0.5, 1), SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(3.5, 1), SwarmMember.Init(BugStr.decode("wQ1"))],
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bQ1"))],
        [Coords.Init(3, 0), SwarmMember.Init(BugStr.decode("bB1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("wG1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugStr.decode("bG1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugStr.decode("wA1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, BlackSpider());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    assertRefinement(Option.isSome, actualEmptyCells);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(1, 0),
          Coords.Init(2, 0),
          Coords.Init(4.5, 1),
          Coords.Init(0.5, 3)
        )
      )
    );
  });

  test.concurrent("Ant", () => {
    const BlackAnt = () => BugStr.decode("bA1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bA1"),
      field: HashMap.make(
        [Coords.Init(0.5, 1), SwarmMember.Init(BugStr.decode("bQ1"))],
        [Coords.Zero, SwarmMember.Init(BugStr.decode("wG1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wQ1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("wB1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugStr.decode("bB1"))],
        [Coords.Init(1, -2), SwarmMember.Init(BlackAnt())]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, BlackAnt());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    const testAnt = Cell.findFirstOccupied(
      swarm.graph,
      Cell.withBugInBasis(BlackAnt())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testAnt);

    expect(
      Equal.equals(
        actualCoords,
        Option.some(
          HashSet.make(
            Coords.Init(1, 2),
            Coords.Init(0, 2),
            Coords.Init(-0.5, 1),
            Coords.Init(1.5, 1),
            Coords.Init(2.5, 1),
            Coords.Init(-1, 0),
            Coords.Init(3, 0),
            Coords.Init(-0.5, -1),
            Coords.Init(2.5, -1),
            Coords.Init(0, -2),
            Coords.Init(2, -2)
          )
        )
      )
    ).toBe(true);
  });

  test.concurrent("Ladybug", () => {
    const Ladybug = () => BugStr.decode("bL1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bQ1"),
      field: HashMap.make(
        [Coords.Init(0.5, 1), SwarmMember.Init(BugStr.decode("bQ1"))],
        [Coords.Zero, SwarmMember.Init(BugStr.decode("wG1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wQ1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("wB1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugStr.decode("bB1"))],
        [Coords.Init(1, -2), SwarmMember.Init(Ladybug())]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, Ladybug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    const testAnt = Cell.findFirstOccupied(
      swarm.graph,
      Cell.withBugInBasis(Ladybug())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testAnt);

    expect(
      Equal.equals(
        actualCoords,
        Option.some(
          HashSet.make(
            Coords.Init(-0.5, 1),
            Coords.Init(1.5, 1),
            Coords.Init(2.5, 1),
            Coords.Init(-1, 0),
            Coords.Init(1, 0),
            Coords.Init(3, 0),
            Coords.Init(-0.5, -1),
            Coords.Init(2.5, -1),
            Coords.Init(0, -2),
            Coords.Init(2, -2)
          )
        )
      )
    ).toBe(true);
  });

  test.concurrent("Mosquito", () => {
    const Mosquito = () => BugStr.decode("wM1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bA1"),
      field: HashMap.make(
        [Coords.Init(1.5, 1), SwarmMember.Init(BugStr.decode("bQ1"))],
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bS1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wB1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wQ1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(Mosquito())]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, Mosquito());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    const testAnt = Cell.findFirstOccupied(
      swarm.graph,
      Cell.withBugInBasis(Mosquito())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testAnt);

    expect(
      Equal.equals(
        actualCoords,
        Option.some(
          HashSet.make(
            Coords.Init(-0.5, 1),
            Coords.Init(0, 0),
            Coords.Init(1, 0),
            Coords.Init(3, 0),
            Coords.Init(-0.5, -1),
            Coords.Init(1.5, -1)
          )
        )
      )
    ).toBe(true);
  });

  test.concurrent("One swarm rule", () => {
    const BlackQueenBee = () => BugStr.decode("bQ1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bA1"),
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bG1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BlackQueenBee())],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugStr.decode("wS1"))],
        [Coords.Init(1, -2), SwarmMember.Init(BugStr.decode("bB1"))],
        [Coords.Init(2, -2), SwarmMember.Init(BugStr.decode("wB1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, BlackQueenBee());

    const testQueenBee = Cell.findFirstOccupied(
      swarm.graph,
      Cell.withBugInBasis(BlackQueenBee())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testQueenBee);

    const validateResult = Swarm.validateSplit(swarm, testQueenBee.value);

    assertRefinement(Either.isLeft, validateResult);

    expect(validateResult.left._tag).toBe("SplitSwarm");
  });

  test.concurrent("One swarm rule: Ladybug", () => {
    const blackLadybug = () => BugStr.decode("bL1");

    const swarm = new Swarm.Swarm({
      lastMovedByPillbug: false,
      lastMoved: BugStr.decode("bA1"),
      field: HashMap.make(
        [Coords.Init(2, 3), SwarmMember.Init(BugStr.decode("wP1"))],
        [Coords.Init(2.5, 1), SwarmMember.Init(BugStr.decode("wB1"))],
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bG1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("bP1"))],
        [Coords.Init(3, 0), SwarmMember.Init(BugStr.decode("wG1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(blackLadybug())],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugStr.decode("wS1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, blackLadybug());

    const testQueenBee = Cell.findFirstOccupied(
      swarm.graph,
      Cell.withBugInBasis(blackLadybug())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testQueenBee);

    const validateResult = Swarm.validateSplit(swarm, testQueenBee.value);

    assertRefinement(Either.isLeft, validateResult);

    expect(validateResult.left._tag).toBe("SplitSwarm");
  });

  test.concurrent("Freedom to move: Beetle can climb", () => {
    const TestBug = () =>
      new Bug.Beetle({
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
        [Coords.Zero, SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wQ1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("bP1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("bA1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.withBugInBasis(x, TestBug())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);
    // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
       ○     ×     ○ 

    ○     P̲̊×M̊   _B̲̊_    × 

 ○    (Å)    Q̊×    P̲̊×    ○ 

    ○     Å̲     ○     ○ 

       ○     ○ 
`);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(1, 0),
          Coords.Init(2, 0),
          Coords.Init(1, 2),
          Coords.Init(2.5, 1),
          Coords.Init(0.5, 1)
        )
      )
    );
  });

  test.concurrent("Freedom to move: Beetle can't climb", () => {
    const TestBug = () =>
      new Bug.Beetle({
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
        [Coords.Zero, SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wQ1"))],
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

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.withBugInBasis(x, TestBug())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);
    // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
       ○     ×     ○ 

    ○     P̲̊×M̊   _B̲̊_    × 

 ○    (Å)    Q̊     P̲̊×B̊    ○ 

    ○     Å̲     ○     ○ 

       ○     ○ 
`);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(2, 0),
          Coords.Init(1, 2),
          Coords.Init(2.5, 1),
          Coords.Init(0.5, 1)
        )
      )
    );
  });

  test.concurrent("Freedom to move: Beetle can't descend", () => {
    const TestBug = () =>
      new Bug.Beetle({
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
        [
          Coords.Init(1, 0),
          SwarmMember.Init(BugStr.decode("wA1")).pipe(
            SwarmMember.addCover(TestBug())
          ),
        ],
        [
          Coords.Init(0.5, -1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.hasBug(x, TestBug()).pipe(Option.isSome)
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
    ○     ○ 

 ○     P̲̊×M̊    × 

   (○)   _Å_B̲̊    × 

 ○     P̲̊×B̊    × 

    ○     ○ `);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(0.5, -1),
          Coords.Init(1.5, -1),
          Coords.Init(0.5, 1),
          Coords.Init(1.5, 1),
          Coords.Init(2, 0)
        )
      )
    );
  });

  test.concurrent("Freedom to move: Mosquito can't descend", () => {
    const TestBug = () =>
      new Bug.Mosquito({
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
        [
          Coords.Init(1, 0),
          SwarmMember.Init(BugStr.decode("wA1")).pipe(
            SwarmMember.addCover(TestBug())
          ),
        ],
        [
          Coords.Init(0.5, -1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.hasBug(x, TestBug()).pipe(Option.isSome)
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
    ○     ○ 

 ○     P̲̊×M̊    × 

   (○)   _Å_M̲̊    × 

 ○     P̲̊×B̊    × 

    ○     ○ `);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(0.5, -1),
          Coords.Init(1.5, -1),
          Coords.Init(0.5, 1),
          Coords.Init(1.5, 1),
          Coords.Init(2, 0)
        )
      )
    );
  });

  test.concurrent("Freedom to move: Ladybug can't descend", () => {
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
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wA2"))],
        [Coords.Init(3, 0), SwarmMember.Init(TestBug())],
        [
          Coords.Init(0.5, -1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.hasBug(x, TestBug()).pipe(Option.isSome)
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
    ○     ○ 

 ○     P̲̊ M̊    ×     ○     ○ 

   (○)    Å     Ä    _L̲̊_    ○ 

 ○     P̲̊ B̊    ×     ○     ○ 

    ○     ○ 
`);

    expect(actualCoords).toEqual(
      Option.some(HashSet.make(Coords.Init(1.5, -1), Coords.Init(1.5, 1)))
    );
  });

  test.concurrent("Freedom to move: Ladybug can't climb", () => {
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
        [Coords.Init(-1, 0), SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(0, 0), SwarmMember.Init(BugStr.decode("wA2"))],
        [Coords.Init(1, 0), SwarmMember.Init(TestBug())],
        [
          Coords.Init(0.5, -1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.hasBug(x, TestBug()).pipe(Option.isSome)
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
             ○     ○ 

    ○     ×     P̲̊ M̊    ○ 

 ○     Å    (Ä)   _L̲̊_    ○ 

    ○     ×     P̲̊ B̊    ○ 

             ○     ○ 

`);

    expect(actualCoords).toEqual(
      Option.some(HashSet.make(Coords.Init(-0.5, 1), Coords.Init(-0.5, -1)))
    );
  });

  test.concurrent("Freedom to move: Mosquito can't climb like Ladybug", () => {
    const TestBug = () =>
      new Bug.Mosquito({
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
        [Coords.Init(-1, 0), SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(0, 0), SwarmMember.Init(BugStr.decode("wA2"))],
        [Coords.Init(1, 0), SwarmMember.Init(TestBug())],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wL1"))],
        [
          Coords.Init(0.5, -1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.hasBug(x, TestBug()).pipe(Option.isSome)
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
             ○     ○ 

    ○     ×     P̲̊×M̊    ○     ○ 

 ○     Å    (Ä)   _M̲̊_    L̊×    ○ 

    ○     ×     P̲̊×B̊    ○     ○ 

             ○     ○ 
`);

    expect(
      Equal.equals(
        actualCoords,
        Option.some(
          HashSet.make(
            //
            Coords.Init(0.5, -1),
            Coords.Init(-0.5, -1),
            Coords.Init(-0.5, 1),
            Coords.Init(2, 0),
            Coords.Init(0.5, 1)
          )
        )
      )
    ).toBe(true);
  });

  test.concurrent("Freedom to move: Ladybug can't descend 2", () => {
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
          Coords.Init(1.5, 1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Mosquito({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wA2"))],
        [Coords.Init(3, 0), SwarmMember.Init(TestBug())],
        [
          Coords.Init(1.5, -1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.hasBug(x, TestBug()).pipe(Option.isSome)
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
       ×     × 

    ×     P̲̊ M̊    ×     ○ 

(○)    Å     Ä    _L̲̊_    ○ 

    ×     P̲̊ B̊    ×     ○ 

       ×     × 
`);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(0.5, 1),
          Coords.Init(2.5, 1),
          Coords.Init(1, 2),
          Coords.Init(2, 2),
          Coords.Init(0.5, -1),
          Coords.Init(2.5, -1),
          Coords.Init(1, -2),
          Coords.Init(2, -2)
        )
      )
    );
  });

  test.concurrent("Freedom to move: Ladybug can descend", () => {
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
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(2, 0), SwarmMember.Init(TestBug())],
        [
          Coords.Init(0.5, -1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.hasBug(x, TestBug()).pipe(Option.isSome)
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
    ×     × 

 ×     P̲̊ M̊    ×     ○ 

   (×)    Å    _L̲̊_    ○ 

 ×     P̲̊ B̊    ×     ○ 

    ×     × 
`);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          //
          Coords.Init(0, 2),
          Coords.Init(1, 2),
          Coords.Init(-0.5, 1),
          Coords.Init(1.5, 1),
          Coords.Zero,
          Coords.Init(0, -2),
          Coords.Init(1, -2),
          Coords.Init(-0.5, -1),
          Coords.Init(1.5, -1)
        )
      )
    );
  });

  test.concurrent("Freedom to move: Beetle can't descend 2", () => {
    const TestBug = () =>
      new Bug.Beetle({
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
            ),
            SwarmMember.addCover(
              new Bug.Mosquito({
                number: BugNumber.One.make(1),
                side: "black",
              })
            )
          ),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(BugStr.decode("wA1")).pipe(
            SwarmMember.addCover(TestBug())
          ),
        ],
        [
          Coords.Init(0.5, -1),
          SwarmMember.Init(BugStr.decode("bP1")).pipe(
            SwarmMember.addCover(
              new Bug.Beetle({
                number: BugNumber.One.make(1),
                side: "white",
              })
            )
          ),
        ]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.hasBug(x, TestBug()).pipe(Option.isSome)
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
    ○     ○ 

 ○     P̲̊×M̊M̲̊    × 

   (○)   _Å_B̲̊    × 

 ○     P̲̊×B̊    × 

    ○     ○ `);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(0.5, -1),
          Coords.Init(1.5, -1),
          Coords.Init(0.5, 1),
          Coords.Init(1.5, 1),
          Coords.Init(2, 0)
        )
      )
    );
  });

  test.concurrent("Freedom to move: Mosquito can't climb", () => {
    const TestBug = () =>
      new Bug.Mosquito({
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
        [Coords.Zero, SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wQ1"))],
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

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.withBugInBasis(x, TestBug())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);
    // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
       ○     ×     ○ 

    ○     P̲̊×M̊   _M̲̊_    × 

 ○    (Å)    Q̊     P̲̊×B̊    ○ 

    ○     Å̲     ○     ○ 

       ○     ○ 
`);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(2, 0),
          Coords.Init(1, 2),
          Coords.Init(0.5, 1),
          Coords.Init(2.5, 1)
        )
      )
    );
  });
  test.concurrent("Freedom to move: Ladybug can't climb", () => {
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
        [Coords.Zero, SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wQ1"))],
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

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );
    const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
      Cell.withBugInBasis(x, TestBug())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testBeetleCell);
    // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

    expect(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testBeetleCell.value,
      })
    ).toBe(trimNewline`
       ○     ○     ○ 

    ×     P̲̊ M̊   _L̲̊_    ○ 

 ×    (Å)    Q̊     P̲̊ B̊    ○ 

    ×     Å̲     ×     ○ 

       ○     ○ 
`);

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(1.5, -1),
          Coords.Init(-1, 0),
          Coords.Init(-0.5, -1),
          Coords.Init(-0.5, 1)
        )
      )
    );
  });
});
