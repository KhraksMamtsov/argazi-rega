import { Data, Tuple } from "effect";
import * as CellBorder from "./CellBorder.ts";
import * as CoordsDelta from "./CoordsDelta.ts";

export class Coords extends Data.Class<{
  x: number;
  y: number;
}> {
  static Init = (x: number, y: number) => new Coords({ x, y });
  static Zero = this.Init(0, 0);

  static Neighbor(coords: Coords, cellBorder: CellBorder.CellBorder): Coords {
    const neighborDelta = CoordsDelta.NeighborsVector[cellBorder];

    return new Coords({
      x: coords.x + neighborDelta.x,
      y: coords.y + neighborDelta.y,
    });
  }

  static Neighbors(coords: Coords) {
    return Tuple.map(CellBorder.CellBorders, (delta) =>
      this.Neighbor(coords, delta)
    );
  }

  override toString() {
    return `${this.x}|${this.y}`;
  }
}
