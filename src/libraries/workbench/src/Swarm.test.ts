import * as Bug from "./game/Bug.ts";
import { Side } from "./game/Side.ts";
import * as Swarm from "./game/Swarm.ts";
import {
  HashMap,
  Option,
  Array,
  Equal,
  Either,
  Predicate,
  HashSet,
} from "effect";
import { SwarmMember } from "./game/SwarmMember.ts";
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
        new SwarmMember({
          bug: new Bug.Ant({ number: 1, side: Side.Black }),
          beetles: [],
        }),
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
          new SwarmMember({
            bug: new Bug.Ant({ number: 1, side: Side.Black }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 1, y: 0 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 2, side: Side.White }),
            beetles: [],
          }),
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
          new SwarmMember({
            bug: new Bug.Ant({ number: 1, side: Side.Black }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 1, y: 0 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 2, side: Side.White }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 0.5, y: -1 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 3, side: Side.White }),
            beetles: [],
          }),
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
          new SwarmMember({
            bug: new Bug.Ant({ number: 1, side: Side.Black }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 1, y: 0 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 2, side: Side.White }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 2, y: 0 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 3, side: Side.White }),
            beetles: [],
          }),
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
          new SwarmMember({
            bug: new Bug.Ant({ number: 1, side: Side.Black }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 1, y: 0 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 2, side: Side.White }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 1.5, y: -1 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 3, side: Side.White }),
            beetles: [],
          }),
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
            new SwarmMember({
              bug: new Bug.Ant({ number: 1, side: Side.Black }),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 1, y: 0 }),
            new SwarmMember({
              bug: new Bug.Ant({ number: 2, side: Side.White }),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 0.5, y: -1 }),
            new SwarmMember({
              bug: TestGrasshopper(),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 1, y: -2 }),
            new SwarmMember({
              bug: new Bug.Ant({ number: 3, side: Side.White }),
              beetles: [],
            }),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(
        swarm,
        TestGrasshopper()
      );
      const actualCoords = actualEmptyCells.pipe(
        Option.map(Array.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(Array.every(Cell.$is("Empty")), actualEmptyCells.value);

      console.log(
        Swarm.toString(swarm, {
          highlightEmpty: HashSet.fromIterable(actualEmptyCells.value),
        })
      );

      expect(actualCoords).toEqual(
        Option.some([
          new Coords({ x: 1.5, y: 1 }),
          new Coords({ x: 1.5, y: -3 }),
          new Coords({ x: -0.5, y: 1 }),
        ])
      );
    });

    test("QueenBee", () => {
      const TestQueenBee = () => new Bug.QueenBee({ side: Side.Black });

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [
            Coords.Zero,
            new SwarmMember({
              bug: new Bug.Ant({ number: 1, side: Side.Black }),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 1, y: 0 }),
            new SwarmMember({
              bug: new Bug.Ant({ number: 2, side: Side.White }),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 0.5, y: -1 }),
            new SwarmMember({
              bug: TestQueenBee(),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 1, y: -2 }),
            new SwarmMember({
              bug: new Bug.Ant({ number: 3, side: Side.White }),
              beetles: [],
            }),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestQueenBee());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(Array.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(Array.every(Cell.$is("Empty")), actualEmptyCells.value);

      console.log(
        Swarm.toString(swarm, {
          highlightEmpty: HashSet.fromIterable(actualEmptyCells.value),
        })
      );

      expect(actualCoords).toEqual(
        Option.some([
          new Coords({ x: 0, y: -2 }),
          new Coords({ x: -0.5, y: -1 }),
        ])
      );
    });
    test("Beetle", () => {
      const TestBug = () => new Bug.Beetle({ number: 1, side: Side.Black });

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [
            Coords.Zero,
            new SwarmMember({
              bug: new Bug.Ant({ number: 1, side: Side.Black }),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 1, y: 0 }),
            new SwarmMember({
              bug: new Bug.Ant({ number: 2, side: Side.White }),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 0.5, y: -1 }),
            new SwarmMember({
              bug: TestBug(),
              beetles: [],
            }),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(Array.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      // assertRefinement(Array.every(Cell.$is("Empty")), actualEmptyCells.value);

      console.log(
        Swarm.toString(swarm, {
          highlightEmpty: HashSet.fromIterable(actualEmptyCells.value),
        })
      );

      expect(actualCoords).toEqual(
        Option.some([
          new Coords({ x: 1.5, y: -1 }),
          new Coords({ x: -0.5, y: -1 }),
          new Coords({ x: 1, y: 0 }),
          Coords.Zero,
        ])
      );
    });
    test("Spider", () => {
      const TestBug = () => new Bug.Spider({ number: 1, side: Side.Black });

      const swarm = new Swarm.Swarm({
        field: HashMap.make(
          [
            Coords.Zero,
            new SwarmMember({
              bug: new Bug.Ant({ number: 1, side: Side.Black }),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 1, y: 0 }),
            new SwarmMember({
              bug: new Bug.Ant({ number: 2, side: Side.White }),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 0.5, y: -1 }),
            new SwarmMember({
              bug: TestBug(),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 1, y: -2 }),
            new SwarmMember({
              bug: new Bug.Ant({ number: 3, side: Side.White }),
              beetles: [],
            }),
          ],
          [
            new Coords({ x: 1.5, y: -3 }),
            new SwarmMember({
              bug: new Bug.Ant({ number: 3, side: Side.Black }),
              beetles: [],
            }),
          ]
        ),
      });

      const actualEmptyCells = Swarm.getMovementCellsFor(swarm, TestBug());
      const actualCoords = actualEmptyCells.pipe(
        Option.map(Array.map((x) => x.coords))
      );

      assertRefinement(Option.isSome, actualEmptyCells);
      assertRefinement(Array.every(Cell.$is("Empty")), actualEmptyCells.value);

      console.log(
        Swarm.toString(swarm, {
          highlightEmpty: HashSet.fromIterable(actualEmptyCells.value),
        })
      );

      expect(actualCoords).toEqual(
        Option.some([
          new Coords({ x: 1, y: -4 }),
          new Coords({ x: -0.5, y: 1 }),
        ])
      );
    });
  });

  test("validateSplit", () => {
    const TestBug = () => new Bug.Beetle({ number: 1, side: Side.Black });

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [
          Coords.Zero,
          new SwarmMember({
            bug: new Bug.Ant({ number: 1, side: Side.Black }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 1, y: 0 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 2, side: Side.White }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 0.5, y: -1 }),
          new SwarmMember({
            bug: TestBug(),
            beetles: [],
          }),
        ]
      ),
    });

    console.log(Swarm.toString(swarm));

    const occupiedCell = Swarm.findFirstOccupied(swarm, (cell) =>
      Equal.equals(cell.coords, new Coords({ x: 0.5, y: -1 }))
    );

    expect(occupiedCell).toMatchObject(Option.some(expect.anything()));

    assertRefinement(Option.isSome, occupiedCell);

    const result = Swarm.validateSplit(occupiedCell.value)(swarm);
    assertRefinement(Either.isRight, result);

    expect(result.right).toEqual(swarm);
  });
  test("validateSplit SplitError", () => {
    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [
          Coords.Zero,
          new SwarmMember({
            bug: new Bug.Ant({ number: 1, side: Side.Black }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 1, y: 0 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 2, side: Side.White }),
            beetles: [],
          }),
        ],
        [
          new Coords({ x: 2, y: 0 }),
          new SwarmMember({
            bug: new Bug.Ant({ number: 3, side: Side.White }),
            beetles: [],
          }),
        ]
      ),
    });

    console.log(Swarm.toString(swarm));

    const occupiedCell = Swarm.findFirstOccupied(swarm, (cell) =>
      Equal.equals(cell.coords, new Coords({ x: 1, y: 0 }))
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
