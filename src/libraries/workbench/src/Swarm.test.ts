import * as Bug from "./game/Bug.ts";
import { Side } from "./game/Side.ts";
import * as Swarm from "./game/Swarm.ts";
import { HashMap, Option, Equal, Either, Predicate, HashSet } from "effect";
import * as SwarmMember from "./game/SwarmMember.ts";
import { Coords } from "./game/Coords.ts";
import { test, describe, expect, assert } from "@effect/vitest";
import * as SwarmError from "./game/SwarmError.ts";
import { Cell } from "./game/Cell.ts";

const EmptySwarm = new Swarm.Swarm({
  field: HashMap.empty(),
});

function assertRefinement<A, B extends A>(
  refinement: Predicate.Refinement<A, B>,
  value: A,
  message?: string
): asserts value is B {
  assert(refinement(value), message);
}

describe("Swarm", () => {
  test("empty field", () => {
    const swarm = EmptySwarm;

    console.log(Swarm.toString(swarm));
    expect(swarm.graphStats).toEqual({
      connections: {
        empty: { empty: 0, occupied: 0 },
        occupied: { empty: 0, occupied: 0 },
      },
      empty: 1,
      occupied: 0,
    });
  });

  test("one member", () => {
    const swarm = new Swarm.Swarm({
      field: HashMap.make([
        Coords.Zero,
        SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
      ]),
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
        [
          Coords.Zero,
          SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
        ]
      ),
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
        [
          Coords.Zero,
          SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.White })),
        ],
        [
          Coords.Init(0.5, -1),
          SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
        ]
      ),
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
      field: HashMap.make(
        [
          Coords.Zero,
          SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
        ],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
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
      field: HashMap.make(
        [
          Coords.Zero,
          SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
        ],
        [
          Coords.Init(1.5, -1),
          SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
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
      const swarm = EmptySwarm;

      const actualResult = Swarm.getMovementCellsFor(
        swarm,
        new Bug.Ant({ number: 1, side: Side.Black })
      );
      expect(actualResult).toEqual(Option.none());
    });

    test("Grasshopper", () => {
      const TestGrasshopper = () =>
        new Bug.Grasshopper({ number: 1, side: Side.Black });

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [
            Coords.Zero,
            SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
          ],
          [
            Coords.Init(1, 0),
            SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
          ],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestGrasshopper())],
          [
            Coords.Init(1, -2),
            SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
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
        HashSet.every(Cell.$is("Empty")),
        actualEmptyCells.value
      );

      console.log(
        Swarm.toString(swarm, {
          highlightEmpty: actualEmptyCells.value,
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
        new Bug.QueenBee({ side: Side.Black, number: 1 });

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [
            Coords.Zero,
            SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
          ],
          [
            Coords.Init(1, 0),
            SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
          ],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestQueenBee())],
          [
            Coords.Init(1, -2),
            SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestQueenBee());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(
        HashSet.every(Cell.$is("Empty")),
        actualEmptyCells.value
      );

      console.log(
        Swarm.toString(swarm, {
          highlightEmpty: actualEmptyCells.value,
        })
      );

      expect(actualCoords).toEqual(
        Option.some(HashSet.make(Coords.Init(0, -2), Coords.Init(-0.5, -1)))
      );
    });
    test("Beetle", () => {
      const TestBug = () => new Bug.Beetle({ number: 1, side: Side.Black });

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [
            Coords.Zero,
            SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
          ],
          [
            Coords.Init(1, 0),
            SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
          ],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      // assertRefinement(Array.every(Cell.$is("Empty")), actualEmptyCells.value);

      console.log(
        Swarm.toString(swarm, {
          highlightEmpty: actualEmptyCells.value,
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
    test("Spider", () => {
      const TestBug = () => new Bug.Spider({ number: 1, side: Side.Black });

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [
            Coords.Zero,
            SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
          ],
          [
            Coords.Init(1, 0),
            SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
          ],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())],
          [
            Coords.Init(1, -2),
            SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
          ],
          [
            Coords.Init(1.5, -3),
            SwarmMember.Init(
              new Bug.Grasshopper({ number: 2, side: Side.Black })
            ),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(
        HashSet.every(Cell.$is("Empty")),
        actualEmptyCells.value
      );

      console.log(
        Swarm.toString(swarm, {
          highlightEmpty: actualEmptyCells.value,
        })
      );

      expect(actualCoords).toEqual(
        Option.some(HashSet.make(Coords.Init(1, -4), Coords.Init(-0.5, 1)))
      );
    });
    test("Ant", () => {
      const TestBug = () => new Bug.Ant({ number: 1, side: Side.Black });

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [
            Coords.Zero,
            SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.Black })),
          ],
          [
            Coords.Init(1, 0),
            SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
          ],
          [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())],
          [
            Coords.Init(1, -2),
            SwarmMember.Init(new Bug.Ant({ number: 3, side: Side.White })),
          ],
          [
            Coords.Init(2, -2),
            SwarmMember.Init(
              new Bug.Grasshopper({ number: 3, side: Side.Black })
            ),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(HashSet.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(
        HashSet.every(Cell.$is("Empty")),
        actualEmptyCells.value
      );

      console.log(
        Swarm.toString(swarm, {
          highlightEmpty: actualEmptyCells.value,
        })
      );

      expect(actualCoords).toEqual(
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
            Coords.Init(-0.5, -1),
            Coords.Init(1.5, 1),
            Coords.Init(2, 0),
            Coords.Init(1.5, -1)
          )
        )
      );
    });
  });

  test.skip("validateSplit", () => {
    const TestBug = () => new Bug.Beetle({ number: 1, side: Side.Black });

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [
          Coords.Zero,
          SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
        ],
        [Coords.Init(0.5, -1), SwarmMember.Init(TestBug())]
      ),
    });

    console.log(Swarm.toString(swarm));

    const occupiedCell = Swarm.findFirstOccupied(swarm, (cell) =>
      Equal.equals(cell.coords, Coords.Init(0.5, -1))
    );

    expect(occupiedCell).toMatchObject(Option.some(expect.anything()));

    assertRefinement(Option.isSome, occupiedCell);

    const result = Swarm.validateSplit(occupiedCell.value)(swarm);
    assertRefinement(Either.isRight, result);

    expect(result.right).toEqual(swarm);
  });
  test.skip("validateSplit SplitError", () => {
    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [
          Coords.Zero,
          SwarmMember.Init(new Bug.Ant({ number: 1, side: Side.Black })),
        ],
        [
          Coords.Init(1, 0),
          SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
        ],
        [
          Coords.Init(2, 0),
          SwarmMember.Init(new Bug.Ant({ number: 2, side: Side.White })),
        ]
      ),
    });

    console.log(Swarm.toString(swarm));
    console.log(swarm.graphStats);

    const occupiedCell = Swarm.findFirstOccupied(swarm, (cell) =>
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
