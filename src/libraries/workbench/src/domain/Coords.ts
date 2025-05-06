import { Schema, Tuple } from "effect";
import * as CellBorder from "./CellBorder.js";
import * as CoordsDelta from "./CoordsDelta.js";

export type _CoordId = typeof _CoordId;
export const _CoordId: unique symbol = Symbol.for("domain/CoordId");
export const Coord = Schema.Number.pipe(
  Schema.filter((x) => x % 0.5 === 0),
  Schema.brand(_CoordId),
  Schema.annotations({
    identifier: "Coord",
  })
);

export type Coord = typeof Coord.Type;

export class Coords extends Schema.Class<Coords>("Coords")({
  x: Coord,
  y: Coord,
}) {
  static Init = (x: number, y: number) =>
    new Coords({ x: Coord.make(x), y: Coord.make(y) });
  static Zero = this.Init(0, 0);

  static Neighbor(coords: Coords, cellBorder: CellBorder.CellBorder): Coords {
    const neighborDelta = CoordsDelta.NeighborsVector[cellBorder];

    return new Coords({
      x: Coord.make(coords.x + neighborDelta.x),
      y: Coord.make(coords.y + neighborDelta.y),
    });
  }

  static Neighbors(coords: Coords) {
    return Tuple.map(CellBorder.CellBorders, (delta) =>
      this.Neighbor(coords, delta)
    );
  }

  override toString() {
    return `${this.x.toString()}|${this.y.toString()}`;
  }
}
