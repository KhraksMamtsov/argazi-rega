import * as Bug from "../game/Bug.ts";
import * as BugNumber from "../game/BugNumber.ts";

import * as Swarm from "../game/Swarm.ts";
import { HashMap, Option, Equal, Either, Predicate, HashSet } from "effect";
import * as SwarmMember from "../game/SwarmMember.ts";
import { Coords } from "../game/Coords.ts";
import { test, describe, expect, assert } from "@effect/vitest";
import * as SwarmError from "../game/SwarmError.ts";
import * as Cell from "../game/Cell.ts";
import { BugDto } from "../api/Bug.dto.ts";
import { assertRefinement } from "./TestUtills.ts";

describe("Swarm", () => {
  test("one member", () => {
    const swarm = new Swarm.Swarm({
      field: HashMap.make([
        Coords.Zero,
        SwarmMember.Init(BugDto.decode("bA1")),
      ]),
      lastMoved: BugDto.decode("bA1"),
      lastMovedByPillbug: false,
    });

    console.log(Swarm.toString(swarm));

    expect(swarm.graphStats).toEqual({
      empty: 6,
      connections: {
        empty: { empty: 12, occupied: 6 },
        occupied: { empty: 6, occupied: 0 },
      },
      occupied: 1,
    });
  });

  test("two members", () => {
    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA2"))]
      ),
      lastMoved: BugDto.decode("bA1"),
      lastMovedByPillbug: false,
    });

    console.log(Swarm.toString(swarm));

    expect(swarm.graphStats).toEqual({
      empty: 8,
      connections: {
        empty: { empty: 16, occupied: 10 },
        occupied: { empty: 10, occupied: 2 },
      },
      occupied: 2,
    });
  });

  test("three triangle", () => {
    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("wA2"))]
      ),
      lastMoved: BugDto.decode("bA1"),
      lastMovedByPillbug: false,
    });

    console.log(Swarm.toString(swarm));

    expect(swarm.graphStats).toEqual({
      empty: 9,
      occupied: 3,
      connections: {
        empty: { empty: 18, occupied: 12 },
        occupied: { empty: 12, occupied: 6 },
      },
    });
  });

  test("three line", () => {
    const swarm = new Swarm.Swarm({
      lastMoved: BugDto.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Zero,
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.One(1), side: "black" })
          ),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.Two(2), side: "white" })
          ),
        ],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.Two(2), side: "white" })
          ),
        ]
      ),
    });

    console.log(Swarm.toString(swarm));

    expect(swarm.graphStats).toEqual({
      empty: 10,
      occupied: 3,
      connections: {
        empty: { empty: 20, occupied: 14 },
        occupied: { empty: 14, occupied: 4 },
      },
    });
  });
  test("three tube", () => {
    const swarm = new Swarm.Swarm({
      lastMoved: BugDto.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [
          Coords.Zero,
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.One(1), side: "black" })
          ),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.Two(2), side: "white" })
          ),
        ],
        [
          Coords.Init(1.5, -1),
          SwarmMember.Init(
            new Bug.Ant({ number: BugNumber.Two(2), side: "white" })
          ),
        ]
      ),
    });

    console.log(Swarm.toString(swarm));

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
    test("bug not found", () => {
      const swarm = new Swarm.Swarm({
        field: HashMap.make([
          Coords.Zero,
          SwarmMember.Init(BugDto.decode("bA2")),
        ]),
        lastMoved: BugDto.decode("bA2"),
        lastMovedByPillbug: false,
      });

      const actualResult = Swarm.getMovementCellsFor(
        swarm,
        new Bug.Ant({ number: BugNumber.One(1), side: "black" })
      );
      expect(actualResult).toEqual(Option.none());
    });

    test("Grasshopper", () => {
      const TestGrasshopper = () =>
        new Bug.Grasshopper({
          number: BugNumber.One(1),
          side: "black",
        });

      const swarm = new Swarm.Swarm({
        lastMoved: BugDto.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [
            Coords.Zero,
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.One(1), side: "black" })
            ),
          ],
          [
            Coords.Init(1, 0),
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.Two(2), side: "white" })
            ),
          ],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestGrasshopper())],
          [
            Coords.Init(1, -2),
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.Two(2), side: "white" })
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

      console.log(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
        })
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

    test("QueenBee", () => {
      const TestQueenBee = () =>
        new Bug.QueenBee({ side: "black", number: BugNumber.One(1) });

      const swarm = new Swarm.Swarm({
        lastMoved: BugDto.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [
            Coords.Zero,
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.One(1), side: "black" })
            ),
          ],
          [
            Coords.Init(1, 0),
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.Two(2), side: "white" })
            ),
          ],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestQueenBee())],
          [
            Coords.Init(1, -2),
            SwarmMember.Init(
              new Bug.Ant({ number: BugNumber.Two(2), side: "white" })
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

      console.log(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
        })
      );

      expect(actualCoords).toEqual(
        Option.some(HashSet.make(Coords.Init(0, -2), Coords.Init(-0.5, -1)))
      );
    });

    test("Pillbug", () => {
      const TestQueenBee = () =>
        new Bug.Pillbug({ side: "white", number: BugNumber.One(1) });

      const swarm = new Swarm.Swarm({
        lastMoved: BugDto.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA2"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestQueenBee())],
          [Coords.Init(1, -2), SwarmMember.Init(BugDto.decode("wA2"))]
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

      console.log(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
        })
      );

      expect(actualCoords).toEqual(
        Option.some(HashSet.make(Coords.Init(0, -2), Coords.Init(-0.5, -1)))
      );
    });
    test("Beetle", () => {
      const TestBug = () => BugDto.decode("bB1");

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA2"))],
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

      console.log(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
          target: testBeetleCell.value,
        })
      );

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

    test("Beetle cover", () => {
      const TestBug = () =>
        new Bug.Beetle({
          number: BugNumber.One(1),
          side: "black",
        });

      const swarm = new Swarm.Swarm({
        lastMoved: BugDto.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA2"))],
          [
            Coords.Init(0.5, -1),
            new SwarmMember.SwarmMember({
              bug: BugDto.decode("bA2"),
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
        Cell.withBugInBasis(x, TestBug())
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      // assertRefinement(Option.isSome, testBeetleCell);
      // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

      console.log(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
          // target: testBeetleCell.value,
        })
      );

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

    test("Mosquito cover", () => {
      const TestBug = () =>
        new Bug.Mosquito({
          number: BugNumber.One(1),
          side: "black",
        });

      const swarm = new Swarm.Swarm({
        lastMoved: BugDto.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA2"))],
          [
            Coords.Init(0.5, -1),
            new SwarmMember.SwarmMember({
              bug: BugDto.decode("bA2"),
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
        Cell.hasBug(x, TestBug())
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(Option.isSome, testBeetleCell);
      // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

      console.log(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
          target: testBeetleCell.value,
        })
      );

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

    test("Mosquito with mosquito", () => {
      const TestBug = () => BugDto.decode("wM1");

      const swarm = new Swarm.Swarm({
        lastMoved: TestBug(),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bM1"))],
          [Coords.Init(1, 0), SwarmMember.Init(TestBug())]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );
      const testBeetleCell = Cell.findFirstOccupied(swarm.graph, (x) =>
        Cell.hasBug(x, TestBug())
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(Option.isSome, testBeetleCell);
      // assertRefinement(Array.every(Cell.refine("Empty")), actualEmptyCells.value);

      console.log(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
          target: testBeetleCell.value,
        })
      );

      expect(actualCoords).toEqual(Option.some(HashSet.make()));
    });

    test("Spider", () => {
      const TestBug = () => BugDto.decode("bS1");

      const swarm = new Swarm.Swarm({
        lastMoved: BugDto.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA2"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())],
          [Coords.Init(1, -2), SwarmMember.Init(BugDto.decode("bA2"))],
          [Coords.Init(1.5, -3), SwarmMember.Init(BugDto.decode("bG3"))]
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

      console.log(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
          target: testSpider.value,
        })
      );

      expect(actualCoords).toEqual(
        Option.some(HashSet.make(Coords.Init(1, -4), Coords.Init(-0.5, 1)))
      );
    });
    test("Ant", () => {
      const TestBug = () => BugDto.decode("bA2");

      const swarm = new Swarm.Swarm({
        lastMoved: BugDto.decode("bA1"),
        lastMovedByPillbug: false,
        field: HashMap.make(
          [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
          [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA2"))],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())],
          [Coords.Init(1, -2), SwarmMember.Init(BugDto.decode("wA3"))],
          [Coords.Init(2, -2), SwarmMember.Init(BugDto.decode("bG3"))]
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

      console.log(
        Swarm.toString(swarm, {
          highlight: actualEmptyCells.value,
          target: testBugCell.value,
        })
      );

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

  test("validateSplit", () => {
    const TestBug = () =>
      new Bug.Beetle({ number: BugNumber.One(1), side: "black" });

    const swarm = new Swarm.Swarm({
      lastMoved: BugDto.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA2"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())]
      ),
    });

    console.log(Swarm.toString(swarm));

    const occupiedCell = Cell.findFirstOccupied(swarm.graph, (cell) =>
      Equal.equals(cell.coords, Coords.Init(0.5, -1))
    );

    expect(occupiedCell).toMatchObject(Option.some(expect.anything()));

    assertRefinement(Option.isSome, occupiedCell);

    const result = Swarm.validateSplit(occupiedCell.value)(swarm);
    assertRefinement(Either.isRight, result);

    expect(result.right).toEqual(swarm);
  });
  test("validateSplit SplitError", () => {
    const swarm = new Swarm.Swarm({
      lastMoved: BugDto.decode("bA1"),
      lastMovedByPillbug: false,
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugDto.decode("bA1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wA2"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugDto.decode("wA3"))]
      ),
    });

    console.log(Swarm.toString(swarm));

    const occupiedCell = Cell.findFirstOccupied(swarm.graph, (cell) =>
      Equal.equals(cell.coords, Coords.Init(1, 0))
    );

    function assertRefinement<A, B extends A>(
      refinement: Predicate.Refinement<A, B>,
      value: A,
      message?: string
    ): asserts value is B {
      assert(refinement(value), message);
    }

    expect(occupiedCell).toMatchObject(Option.some(expect.anything()));

    assertRefinement(Option.isSome, occupiedCell);

    const result = Swarm.validateSplit(occupiedCell.value)(swarm);

    assertRefinement(Either.isLeft, result);

    expect(result.left).toEqual(
      new SwarmError.SplitSwarm({ cell: occupiedCell.value })
    );
  });
});
