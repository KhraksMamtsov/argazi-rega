import { test, expect, describe } from "vitest";
import * as Cell from "./game/Cell.ts";
import * as Bug from "./game/Bug.ts";
import { Side } from "./game/Side.ts";
import { Empty } from "@effect/platform/HttpApiSchema";
import * as Swarm from "./game/Swarm.ts";

describe("Cell", () => {
  test("mutateDetachBug", () => {
    const single = Cell.Occupied.Detached(
      new Bug.Ant({
        number: 1,
        side: Side.White,
      })
    );
    // const qwe = Cell.mutateDetachBug(
    //   new Bug.Ant({
    //     number: 1,
    //     side: Side.Black,
    //   })
    // )(single);

    const qwe = Cell.mutateAttachBug(
      new Bug.Ant({
        number: 1,
        side: Side.Black,
      })
    )(single.neighbors[2]);
    console.log(qwe);
    //@ts-ignore
    console.log(Swarm.toString(Swarm.getCoordsMap(qwe.right)));
  });
  // test("reduce", () => {
  //   const Ab1 = Cell.detachedCellWithBug(
  //     new Bug.Ant({
  //       number: 1,
  //       side: Side.Black,
  //     })
  //   );
  //   const Bw1 = Cell.detachedCellWithBug(
  //     new Bug.Beetle({
  //       number: 1,
  //       side: Side.White,
  //     })
  //   );
  //   Bw1.neighbors[2] = Ab1;
  //   Ab1.neighbors[5] = Bw1;
  //   const hiveSize = Cell.reduce(Ab1, 0, (acc, cur) =>
  //     cur._tag === "CellWithBug" ? acc + 1 : acc
  //   );
  //   expect(hiveSize).toBe(2);
  //   const hiveEmptySize = Cell.reduce(Bw1, 0, (acc, cur) =>
  //     cur._tag === "EmptyCell" ? acc + 1 : acc
  //   );
  //   expect(hiveEmptySize).toBe(8);
  // });
});
