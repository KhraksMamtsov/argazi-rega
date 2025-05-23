import * as Bug from "../domain/Bug.js";
import * as BugNumber from "../domain/BugNumber.js";

import * as Swarm from "../domain/Swarm.js";
import { HashMap, Option, Equal, Either, HashSet } from "effect";
import * as SwarmMember from "../domain/SwarmMember.js";
import { Coords } from "../domain/Coords.js";
import { test, describe, expect } from "@effect/vitest";
import * as SwarmError from "../domain/SwarmError.js";
import * as Cell from "../domain/Cell.js";
import { BugStr } from "../api/Bug.str.js";
import { assertRefinement, trimNewline } from "./TestUtills.js";

describe("Swarm", () => {
  test.concurrent("one member", () => {
    const swarm = new Swarm.Swarm({
      field: HashMap.make([
        Coords.Zero,
        SwarmMember.Init(BugStr.decode("bA1")),
      ]),
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
    });

    expect(swarm.graphStats).toEqual({
      empty: 6,
      connections: {
        empty: { empty: 12, occupied: 6 },
        occupied: { empty: 6, occupied: 0 },
      },
      occupied: 1,
    });
  });

  test.concurrent("two members", () => {
    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))]
      ),
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
    });

    expect(swarm.graphStats).toEqual({
      empty: 8,
      connections: {
        empty: { empty: 16, occupied: 10 },
        occupied: { empty: 10, occupied: 2 },
      },
      occupied: 2,
    });
  });

  test.concurrent("three triangle", () => {
    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugStr.decode("wA2"))]
      ),
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
    });

    expect(swarm.graphStats).toEqual({
      empty: 9,
      occupied: 3,
      connections: {
        empty: { empty: 18, occupied: 12 },
        occupied: { empty: 12, occupied: 6 },
      },
    });
  });

  test.concurrent("three line", () => {
    const swarm = new Swarm.Swarm({
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Zero,
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.One.make(1), side: "black" })
          ),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.Two.make(2), side: "white" })
          ),
        ],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.Two.make(2), side: "white" })
          ),
        ]
      ),
    });

    expect(swarm.graphStats).toEqual({
      empty: 10,
      occupied: 3,
      connections: {
        empty: { empty: 20, occupied: 14 },
        occupied: { empty: 14, occupied: 4 },
      },
    });
  });
  test.concurrent("three tube", () => {
    const swarm = new Swarm.Swarm({
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Zero,
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.One.make(1), side: "black" })
          ),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.Two.make(2), side: "white" })
          ),
        ],
        [
          Coords.Init(1.5, -1),
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.Two.make(2), side: "white" })
          ),
        ]
      ),
    });

    expect(swarm.graphStats).toEqual({
      empty: 10,
      occupied: 3,
      connections: {
        empty: { empty: 20, occupied: 14 },
        occupied: { empty: 14, occupied: 4 },
      },
    });
  });

  describe("getMovementCellsFor", () => {
    test.concurrent("bug not found", () => {
      const swarm = new Swarm.Swarm({
        field: HashMap.make([
          Coords.Zero,
          SwarmMember.Init(BugStr.decode("bA2")),
        ]),
        lastMoved: BugStr.decode("bA2"),
        lastMovedByPillbug: false,
      });

      const actualResult = Swarm.getMovementCellsFor(
        swarm,
        new Bug.Ant({ number: BugNumber.One.make(1), side: "black" })
      );
      expect(actualResult).toEqual(Option.none());
    });

    test.concurrent("Grasshopper", () => {
      const TestGrasshopper = () =>
        new Bug.Grasshopper({
          number: BugNumber.One.make(1),
          side: "black",
        });

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [
            Coords.Zero,
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.One.make(1), side: "black" })
            ),
          ],
          [
            Coords.Init(1, 0),
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.Two.make(2), side: "white" })
            ),
          ],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestGrasshopper())],
          [
            Coords.Init(1, -2),
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.Two.make(2), side: "white" })
            ),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(
        swarm,
        TestGrasshopper()
      );
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
            Coords.Init(1.5, -3),
            Coords.Init(-0.5, 1)
          )
        )
      );
    });

    test.concurrent("QueenBee", () => {
      const TestQueenBee = () =>
        new Bug.QueenBee({ side: "black", number: BugNumber.One.make(1) });

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [
            Coords.Zero,
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.One.make(1), side: "black" })
            ),
          ],
          [
            Coords.Init(1, 0),
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.Two.make(2), side: "white" })
            ),
          ],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestQueenBee())],
          [
            Coords.Init(1, -2),
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.Two.make(2), side: "white" })
            ),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestQueenBee());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(
        HashSet.every(Cell.refine("Empty")),
        actualEmptyCells.value
      );

      expect(actualCoords).toEqual(
        Option.some(HashSet.make(Coords.Init(0, -2), Coords.Init(-0.5, -1)))
      );
    });

    test.concurrent("Slideable move: QueenBee", () => {
      const TestQueenBee = () => BugStr.decode("wQ1");

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Init(1.5, 1), SwarmMember.Init(TestQueenBee())],
          [Coords.Zero, SwarmMember.Init(BugStr.decode("wG1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("bG1"))],
          [Coords.Init(3, 0), SwarmMember.Init(BugStr.decode("bS1"))],
          [Coords.Init(1.5, -1), SwarmMember.Init(BugStr.decode("wA1"))],
          [Coords.Init(2.5, -1), SwarmMember.Init(BugStr.decode("wA2"))]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestQueenBee());
      // const actualCoords = actualEmptyCells.pipe(
      //   Option.map(HashSet.map((x) => x.coords))
      // );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(
        HashSet.every(Cell.refine("Empty")),
        actualEmptyCells.value
      );

      expect(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
        })
      ).toEqual(
        trimNewline`
             ○     ○ 

    ○     ×     Q̊     ○     ○ 

 ○    (G̊)    G̲̊     ×     S̲̊     ○ 

    ○     ○     Å     Ä     ○ 

             ○     ○     ○ `
      );
    });

    test.concurrent("Ladybug", () => {
      const TestQueenBee = () => BugStr.decode("wL1");

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Init(1.5, 1), SwarmMember.Init(TestQueenBee())],
          [Coords.Zero, SwarmMember.Init(BugStr.decode("wG1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("bG1"))],
          [Coords.Init(3, 0), SwarmMember.Init(BugStr.decode("bS1"))],
          [Coords.Init(1.5, -1), SwarmMember.Init(BugStr.decode("wA1"))],
          [Coords.Init(2.5, -1), SwarmMember.Init(BugStr.decode("wA2"))]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestQueenBee());
      // const actualCoords = actualEmptyCells.pipe(
      //   Option.map(HashSet.map((x) => x.coords))
      // );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(
        HashSet.every(Cell.refine("Empty")),
        actualEmptyCells.value
      );

      expect(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
        })
      ).toEqual(
        trimNewline`
             ○     ○ 

    ×     ×     L̊     ○     ○ 

 ×    (G̊)    G̲̊     ×     S̲̊     ○ 

    ×     ×     Å     Ä     ○ 

             ×     ×     ○ `
      );
    });

    test.concurrent("Pillbug", () => {
      const TestQueenBee = () =>
        new Bug.Pillbug({ side: "white", number: BugNumber.One.make(1) });

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestQueenBee())],
          [Coords.Init(1, -2), SwarmMember.Init(BugStr.decode("wA2"))]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestQueenBee());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(
        HashSet.every(Cell.refine("Empty")),
        actualEmptyCells.value
      );

      expect(actualCoords).toEqual(
        Option.some(HashSet.make(Coords.Init(0, -2), Coords.Init(-0.5, -1)))
      );
    });
    test.concurrent("Beetle", () => {
      const TestBug = () => BugStr.decode("bB1");

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())]
        ),
        lastMoved: TestBug(),
        lastMovedByPillbug: false,
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

 ○    (Å̲×    Ä×    ○ 

    ×    _B̲̊_    × 

       ○     ○ 
`);

      expect(actualCoords).toEqual(
        Option.some(
          HashSet.make(
            Coords.Init(1.5, -1),
            Coords.Init(-0.5, -1),
            Coords.Init(1, 0),
            Coords.Zero
          )
        )
      );
    });

    test.concurrent("Beetle cover", () => {
      const TestBug = () =>
        new Bug.Beetle({
          number: BugNumber.One.make(1),
          side: "black",
        });

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))],
          [
            Coords.Init(0.5, -1),
            new SwarmMember.SwarmMember({
              bug: BugStr.decode("bA2"),
              cover: [TestBug()],
            }),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );
      const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
        Cell.hasBug(x, TestBug()).pipe(
          Option.match({
            onNone: () => false,
            onSome: () => true,
          })
        )
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

 ○    (Å̲×    Ä×    ○ 

    ×    _Ä̲_B̲̊    × 

       ×     × `);

      expect(actualCoords).toEqual(
        Option.some(
          HashSet.make(
            Coords.Init(1, 0),
            Coords.Zero,
            Coords.Init(-0.5, -1),
            Coords.Init(1.5, -1),
            Coords.Init(0, -2),
            Coords.Init(1, -2)
          )
        )
      );
    });

    test.concurrent("Mosquito cover", () => {
      const TestBug = () =>
        new Bug.Mosquito({
          number: BugNumber.One.make(1),
          side: "black",
        });

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))],
          [
            Coords.Init(0.5, -1),
            new SwarmMember.SwarmMember({
              bug: BugStr.decode("bA2"),
              cover: [TestBug()],
            }),
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
      // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

      expect(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
          target: testBeetleCell.value,
        })
      ).toBe(trimNewline`
    ○     ○     ○ 

 ○    (Å̲×    Ä×    ○ 

    ×    _Ä̲_M̲̊    × 

       ×     × `);

      expect(actualCoords).toEqual(
        Option.some(
          HashSet.make(
            Coords.Init(1, 0),
            Coords.Zero,
            Coords.Init(-0.5, -1),
            Coords.Init(1.5, -1),
            Coords.Init(0, -2),
            Coords.Init(1, -2)
          )
        )
      );
    });

    test.concurrent("Mosquito with mosquito", () => {
      const TestBug = () => BugStr.decode("wM1");

      const swarm = new Swarm.Swarm({
        lastMoved: TestBug(),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bM1"))],
          [Coords.Init(1, 0), SwarmMember.Init(TestBug())]
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
      // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

      expect(actualCoords).toEqual(Option.some(HashSet.make()));
    });

    test.concurrent("Spider", () => {
      const TestBug = () => BugStr.decode("bS1");

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())],
          [Coords.Init(1, -2), SwarmMember.Init(BugStr.decode("bA2"))],
          [Coords.Init(1.5, -3), SwarmMember.Init(BugStr.decode("bG3"))]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );
      const testSpider = Cell.findFirstOccupied(
        swarm.graph,
        Cell.withBugInBasis(TestBug())
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(Option.isSome, testSpider);
      assertRefinement(
        HashSet.every(Cell.refine("Empty")),
        actualEmptyCells.value
      );

      expect(actualCoords).toEqual(
        Option.some(HashSet.make(Coords.Init(1, -4), Coords.Init(-0.5, 1)))
      );
    });

    test.concurrent("Spider no backtrack", () => {
      const TestBug = () => BugStr.decode("bS1");

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))],
          [Coords.Init(-0.5, -1), SwarmMember.Init(TestBug())],
          [Coords.Init(-1, -2), SwarmMember.Init(BugStr.decode("bA2"))],
          [Coords.Init(1, -2), SwarmMember.Init(BugStr.decode("bP1"))],
          [Coords.Init(-0.5, -3), SwarmMember.Init(BugStr.decode("wG3"))],
          [Coords.Init(0.5, -3), SwarmMember.Init(BugStr.decode("wB2"))]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );
      const testSpider = Cell.findFirstOccupied(
        swarm.graph,
        Cell.withBugInBasis(TestBug())
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(Option.isSome, testSpider);
      assertRefinement(
        HashSet.every(Cell.refine("Empty")),
        actualEmptyCells.value
      );

      expect(actualCoords).toEqual(
        Option.some(HashSet.make(Coords.Init(0.5, 1), Coords.Init(-1.5, -3)))
      );
    });
    test.concurrent("Ant", () => {
      const TestBug = () => BugStr.decode("bA2");

      const swarm = new Swarm.Swarm({
        lastMoved: BugStr.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())],
          [Coords.Init(1, -2), SwarmMember.Init(BugStr.decode("wA3"))],
          [Coords.Init(2, -2), SwarmMember.Init(BugStr.decode("bG3"))]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(
        HashSet.every(Cell.refine("Empty")),
        actualEmptyCells.value
      );

      const testBugCell = Cell.findFirstOccupied(swarm.graph, (x) =>
        Equal.equals(x.member.bug, TestBug())
      );

      assertRefinement(Option.isSome, testBugCell);

      expect(
        Equal.equals(
          actualCoords,
          Option.some(
            HashSet.make(
              Coords.Init(0, -2),
              Coords.Init(0.5, -3),
              Coords.Init(-1, 0),
              Coords.Init(1.5, -3),
              Coords.Init(2.5, -1),
              Coords.Init(-0.5, 1),
              Coords.Init(2.5, -3),
              Coords.Init(0.5, 1),
              Coords.Init(3, -2),
              Coords.Init(1.5, 1),
              Coords.Init(-0.5, -1),
              Coords.Init(2, 0),
              Coords.Init(1.5, -1)
            )
          )
        )
      ).toBe(true);
    });
  });

  test.concurrent("validateSplit", () => {
    const TestBug = () =>
      new Bug.Beetle({ number: BugNumber.One.make(1), side: "black" });

    const swarm = new Swarm.Swarm({
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())]
      ),
    });

    const occupiedCell = Cell.findFirstOccupied(swarm.graph, (cell) =>
      Equal.equals(cell.coords, Coords.Init(0.5, -1))
    );

    expect(occupiedCell).toMatchObject(Option.some(expect.anything()));

    assertRefinement(Option.isSome, occupiedCell);

    const result = Swarm.validateSplit(occupiedCell.value)(swarm);
    assertRefinement(Either.isRight, result);

    expect(result.right).toEqual(swarm);
  });
  test.concurrent("validateSplit SplitError", () => {
    const swarm = new Swarm.Swarm({
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("wA2"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wA3"))]
      ),
    });

    const occupiedCell = Cell.findFirstOccupied(swarm.graph, (cell) =>
      Equal.equals(cell.coords, Coords.Init(1, 0))
    );

    expect(occupiedCell).toMatchObject(Option.some(expect.anything()));

    assertRefinement(Option.isSome, occupiedCell);

    const result = Swarm.validateSplit(occupiedCell.value)(swarm);

    assertRefinement(Either.isLeft, result);

    expect(result.left).toEqual(
      new SwarmError.SplitSwarm({ cell: occupiedCell.value })
    );
  });

  test.concurrent(".possibleMoves", () => {
    const swarm = new Swarm.Swarm({
      lastMoved: BugStr.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugStr.decode("bQ1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugStr.decode("bB2"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugStr.decode("wA2"))],
        [Coords.Init(-1, 0), SwarmMember.Init(BugStr.decode("wA3"))]
      ),
    });

    expect(Swarm.possibleMoves("black")(swarm)).toStrictEqual(HashSet.make());
  });
});
