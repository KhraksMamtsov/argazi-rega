/* eslint-disable */
import { Data, Option, Array, pipe, Pipeable, Equal, Either } from "effect";
import * as Cell from "./Cell.ts";
import { Side } from "./Side.ts";
import * as CellBorder from "./CellBorder.ts";
import * as Bug from "./Bug.ts";

export interface Hive extends Pipeable.Pipeable {
  _tag: "Hive";
  initialCell: Cell.Cell;
}

class HiveImpl
  extends Data.TaggedClass("Hive")<{
    initialCell: Cell.Cell;
  }>
  implements Hive
{
  pipe() {
    return Pipeable.pipeArguments(this, arguments);
  }
}

export const empty = (): Hive =>
  new HiveImpl({
    initialCell: Cell.Empty.Empty(),
  });

export const reduceWithFilter = <B>(
  startCell: Cell.Cell,
  b: B,
  filterPath: (cell: Cell.Cell) => boolean,
  f: (b: B, a: Cell.Cell) => B
): B => {
  let acc = b;
  const cellsToVisit = [startCell];
  const visitedCells = new Set();

  while (cellsToVisit.length) {
    const currentCell = cellsToVisit.pop();

    if (currentCell === undefined) {
      continue;
    }
    if (visitedCells.has(currentCell)) {
      continue;
    }
    if (filterPath(currentCell)) {
      continue;
    }

    acc = f(acc, currentCell);

    Cell.Cell.$match(currentCell, {
      Occupied: (x) => cellsToVisit.push(...x.neighbors),
      Empty: (x) => cellsToVisit.push(...pipe(x.neighbors, Array.getSomes)),
    });

    visitedCells.add(currentCell);
  }

  return acc;
};

export const reduce = <B>(
  initialCell: Cell.Cell,
  b: B,
  f: (b: B, a: Cell.Cell) => B
): B => reduceWithFilter(initialCell, b, () => true, f);

export const filter =
  (predicate: (cell: Cell.Cell) => boolean) => (hive: Hive) =>
    reduce<Array<Cell.Cell>>(hive.initialCell, Array.empty(), (acc, cur) => {
      if (predicate(cur)) {
        acc.push(cur);
      }
      return acc;
    });

export const find = (hive: Hive, predicate: (cell: Cell.Cell) => boolean) => {
  const predicateOption = Option.liftPredicate(predicate);
  return reduce(hive.initialCell, Option.none<Cell.Cell>(), (acc, cur) =>
    acc.pipe(Option.orElse(() => predicateOption(cur)))
  );
};

export const bugsCount = (hive: Hive) => {
  const { black, white } = bugs(hive);
  return black.length + white.length;
};

export const bugs = (hive: Hive) =>
  reduce<Record<Side, Array<Bug.Bug>>>(
    hive.initialCell,
    {
      [Side.White]: [],
      [Side.Black]: [],
    },
    (acc, cur) => {
      if (Cell.Occupied.is(cur)) {
        cur.bugs.forEach((bug) => acc[bug.side].push(bug));
      }
      return acc;
    }
  );

export const introduceCells = (side: Side) => (hive: Hive) =>
  hive.pipe(
    filter(
      Cell.match({
        Empty: (emptyCell) =>
          pipe(
            emptyCell.neighbors,
            Array.getSomes,
            Array.filter(Cell.Occupied.is),
            Array.every((x) => x.side === side)
          ),
        Occupied: () => false,
      })
    )
  );

const movesStrategies: Record<
  Bug.Bug["_tag"],
  (from: Cell.Occupied) => Array<Cell.Cell>
> = {
  Ant: (from) => {
    throw "notImplemented";
  },
  Grasshopper: (from) =>
    Array.map(
      Cell.bordersWithNeighborsOccupied(from),
      getEmptyByDiagonal(from)
    ),
  Beetle: (from) => [
    ...Cell.slideableNeighborsEmptyCells(from),
    ...Array.filter(from.neighbors, Cell.Occupied.is),
  ],
  Spider: (from) => {
    const stepOne = Array.flatMap([from], Cell.slideableNeighborsEmptyCells);
    const stepTwo = Array.flatMap(stepOne, Cell.slideableNeighborsEmptyCells);
    const stepThree = Array.flatMap(stepTwo, Cell.slideableNeighborsEmptyCells);
    const forbiddenCells = [...stepOne, ...stepTwo];

    const contains = Array.containsWith(Cell.Equivalence);

    return Array.filter(stepThree, (x) => contains(forbiddenCells, x));
  },
  QueenBee: (from) => Cell.slideableNeighborsEmptyCells(from),
};

export const movementCells = (from: Cell.Occupied) => (hive: Hive) => {
  const bug = Array.lastNonEmpty(from.bugs);

  const moveCells = movesStrategies[bug._tag](from);

  return pipe(
    hive,
    validateSplitHiveWithEmptyCell(from),
    Either.map(() => moveCells)
  );
};

export const getEmptyByDiagonal =
  (from: Cell.Cell) =>
  (border: CellBorder.CellBorder): Cell.Empty =>
    Cell.match(from, {
      Empty: (x) => x,
      Occupied: (x) => getEmptyByDiagonal(x.neighbors[border])(border),
    });

export class SplitHiveError extends Data.TaggedError("SplitHiveError") {}

export const validateSplitHiveWithEmptyCell =
  (cell: Cell.Occupied) =>
  (hive: Hive): Either.Either<Hive, SplitHiveError> => {
    const bugsWithoutCell = reduceWithFilter(
      hive.initialCell,
      0,
      (x) => Cell.Occupied.is(x) && !Equal.equals(x.coords, cell.coords),
      (acc, cur) =>
        acc +
        Cell.match({
          Empty: () => 0,
          Occupied: (x) => x.bugs.length,
        })(cur)
    );

    if (bugsCount(hive) !== bugsWithoutCell) {
      return Either.left(new SplitHiveError());
    } else {
      return Either.right(hive);
    }
  };

type HiveLine_ = ReadonlyArray<Cell.Cell>;
type Hive_ = ReadonlyArray<HiveLine_>;
