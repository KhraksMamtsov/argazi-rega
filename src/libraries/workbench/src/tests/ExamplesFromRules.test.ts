import * as Bug from "../game/Bug.ts";
import * as BugNumber from "../game/BugNumber.ts";
import { SideSchema } from "../game/Side.ts";
import * as Swarm from "../game/Swarm.ts";
import { HashMap, Option, Equal, Either, Predicate, HashSet } from "effect";
import * as SwarmMember from "../game/SwarmMember.ts";
import { Coords } from "../game/Coords.ts";
import { test, describe, expect, assert } from "@effect/vitest";
import * as SwarmError from "../game/SwarmError.ts";
import * as Cell from "../game/Cell.ts";
import { BugDto } from "../api/Bug.dto.ts";

function assertRefinement<A, B extends A>(
  refinement: Predicate.Refinement<A, B>,
  value: A,
  message?: string
): asserts value is B {
  assert(refinement(value), message);
}

describe("Examples from rules", () => {
  test("QueenBee", () => {
    const BlackQueenBee = () => BugDto.decode("bQ1");

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Init(1, 2), SwarmMember.Init(BugDto.decode("bA1"))],
        [Coords.Init(2, 2), SwarmMember.Init(BugDto.decode("wS1"))],
        [Coords.Init(2.5, 1), SwarmMember.Init(BugDto.decode("bS1"))],
        [Coords.Init(0.5, 1), SwarmMember.Init(BlackQueenBee())],
        [Coords.Zero, SwarmMember.Init(BugDto.decode("bG1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugDto.decode("wQ1"))],
        [Coords.Init(3, 0), SwarmMember.Init(BugDto.decode("bB1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("wG1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugDto.decode("wA1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugDto.decode("wB1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, BlackQueenBee());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(
      HashSet.every(Cell.Cell.$is("Empty")),
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
          Coords.Init(1, 0),
          Coords.Init(-0.5, 1),
          Coords.Init(0, 2)
        )
      )
    );
  });

  test("Beetle", () => {
    const WhiteBeetle = () => BugDto.decode("wB1");

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Init(0.5, 1), SwarmMember.Init(BugDto.decode("wS1"))],
        [Coords.Init(1.5, 1), SwarmMember.Init(WhiteBeetle())],
        [Coords.Zero, SwarmMember.Init(BugDto.decode("wQ1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugDto.decode("bA1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("wA1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugDto.decode("bQ1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugDto.decode("bG1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, WhiteBeetle());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    assertRefinement(Option.isSome, actualEmptyCells);

    console.log(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
      })
    );

    expect(actualCoords).toEqual(
      Option.some(
        HashSet.make(
          Coords.Init(0.5, 1),
          Coords.Init(2.5, 1),
          Coords.Init(2, 0),
          Coords.Init(1, 2)
        )
      )
    );
  });

  test("Grasshopper", () => {
    const WhiteGrasshopper = () => BugDto.decode("wG1");

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Init(0.5, 1), SwarmMember.Init(BugDto.decode("bA1"))],
        [Coords.Init(1.5, 1), SwarmMember.Init(BugDto.decode("wA1"))],
        [Coords.Zero, SwarmMember.Init(BugDto.decode("bQ1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugDto.decode("wS1"))],
        [Coords.Init(3, 0), SwarmMember.Init(BugDto.decode("bB1"))],
        [Coords.Init(4, 0), SwarmMember.Init(BugDto.decode("bS1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(WhiteGrasshopper())],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugDto.decode("bG1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugDto.decode("wQ1"))],
        [Coords.Init(4.5, -1), SwarmMember.Init(BugDto.decode("wS2"))],
        [Coords.Init(1, -2), SwarmMember.Init(BugDto.decode("wB1"))],
        [Coords.Init(4, -2), SwarmMember.Init(BugDto.decode("bS2"))]
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

    console.log(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
      })
    );

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

  test("Spider", () => {
    const BlackSpider = () => BugDto.decode("bS1");

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Init(2.5, 3), SwarmMember.Init(BlackSpider())],
        [Coords.Init(1, 2), SwarmMember.Init(BugDto.decode("wB1"))],
        [Coords.Init(3, 2), SwarmMember.Init(BugDto.decode("wS1"))],
        //
        [Coords.Init(0.5, 1), SwarmMember.Init(BugDto.decode("bA1"))],
        [Coords.Init(3.5, 1), SwarmMember.Init(BugDto.decode("wQ1"))],
        [Coords.Zero, SwarmMember.Init(BugDto.decode("bQ1"))],
        [Coords.Init(3, 0), SwarmMember.Init(BugDto.decode("bB1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("wG1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugDto.decode("bG1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugDto.decode("wA1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, BlackSpider());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    assertRefinement(Option.isSome, actualEmptyCells);

    console.log(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
      })
    );

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

  test("Ant", () => {
    const BlackAnt = () => BugDto.decode("bA1");

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Init(0.5, 1), SwarmMember.Init(BugDto.decode("bQ1"))],
        [Coords.Zero, SwarmMember.Init(BugDto.decode("wG1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugDto.decode("wQ1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("wB1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugDto.decode("bB1"))],
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

    console.log(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testAnt.value,
      })
    );

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

  test("Ladybug", () => {
    const Ladybug = () => BugDto.decode("bL1");

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Init(0.5, 1), SwarmMember.Init(BugDto.decode("bQ1"))],
        [Coords.Zero, SwarmMember.Init(BugDto.decode("wG1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugDto.decode("wQ1"))],
        [Coords.Init(0.5, -1), SwarmMember.Init(BugDto.decode("wB1"))],
        [Coords.Init(1.5, -1), SwarmMember.Init(BugDto.decode("bB1"))],
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

    console.log(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testAnt.value,
      })
    );

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

  test("Mosquito", () => {
    const Mosquito = () => BugDto.decode("wM1");

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Init(1.5, 1), SwarmMember.Init(BugDto.decode("bQ1"))],
        [Coords.Zero, SwarmMember.Init(BugDto.decode("bS1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BugDto.decode("wB1"))],
        [Coords.Init(2, 0), SwarmMember.Init(BugDto.decode("wQ1"))],
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

    console.log(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testAnt.value,
      })
    );

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

  test("One swarm rule", () => {
    const BlackQueenBee = () => BugDto.decode("bQ1");

    const swarm = new Swarm.Swarm({
      field: HashMap.make(
        [Coords.Zero, SwarmMember.Init(BugDto.decode("bG1"))],
        [Coords.Init(1, 0), SwarmMember.Init(BlackQueenBee())],
        [Coords.Init(2, 0), SwarmMember.Init(BugDto.decode("bA1"))],
        [Coords.Init(2.5, -1), SwarmMember.Init(BugDto.decode("wS1"))],
        [Coords.Init(1, -2), SwarmMember.Init(BugDto.decode("bB1"))],
        [Coords.Init(2, -2), SwarmMember.Init(BugDto.decode("wB1"))]
      ),
    });

    const actualEmptyCells = Swarm.getMovementCellsFor(swarm, BlackQueenBee());
    const actualCoords = actualEmptyCells.pipe(
      Option.map(HashSet.map((x) => x.coords))
    );

    const testQueenBee = Cell.findFirstOccupied(
      swarm.graph,
      Cell.withBugInBasis(BlackQueenBee())
    );

    assertRefinement(Option.isSome, actualEmptyCells);
    assertRefinement(Option.isSome, testQueenBee);

    const validateResult = Swarm.validateSplit(swarm, testQueenBee.value);

    console.log(
      Swarm.toString(swarm, {
        highlight: actualEmptyCells.value,
        target: testQueenBee.value,
      })
    );

    assertRefinement(Either.isLeft, validateResult);

    expect(validateResult.left._tag).toBe("SplitSwarm");
  });
});
