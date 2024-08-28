import { test, expect, describe } from "vitest";
import * as Hive from "./game/Hive.ts";
import * as Bug from "./game/Bug.ts";
import { Side } from "./game/Side.ts";

describe("Hive", () => {
  test("introduceCells", () => {
    const Ab1 = new Bug.Ant({
      number: 1,
      side: Side.Black,
    });
    const emptyHive = Hive.empty();
    const emptyHiveIntroduceCells = emptyHive.pipe(Hive.introduceCells(Ab1));

    expect(emptyHiveIntroduceCells).toStrictEqual([emptyHive.initialCell]);
  });
});
