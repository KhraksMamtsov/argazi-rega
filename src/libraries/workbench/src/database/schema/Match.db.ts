import * as DB from "drizzle-orm/sqlite-core";
import { AllBugs } from "../../api/Bug.dto.ts";
import { sides } from "../../domain/Side.ts";

export const PlayerTable = DB.sqliteTable("Player", {
  id: DB.text().primaryKey().notNull(),
  nickname: DB.text({ mode: "text" }).notNull(),
});

export const MatchTable = DB.sqliteTable("Match", {
  id: DB.text().primaryKey().notNull(),
  owner: DB.text({ mode: "text" })
    .notNull()
    .references(() => PlayerTable.id),
  opponent: DB.text({ mode: "text" })
    .notNull()
    .references(() => PlayerTable.id),
});

export const MatchSettingsTable = DB.sqliteTable("MatchSettings", {
  match: DB.text()
    .notNull()
    .references(() => PlayerTable.id),
  ownerSide: DB.text({
    enum: sides,
    mode: "text",
  }),
  ladybug: DB.integer({ mode: "boolean" }).notNull(),
  pillpug: DB.integer({ mode: "boolean" }).notNull(),
  mosquito: DB.integer({ mode: "boolean" }).notNull(),
});

export const MoveTable = DB.sqliteTable("Move", {
  match: DB.text({ mode: "text" })
    .notNull()
    .references(() => MatchTable.id),
  side: DB.integer({ mode: "boolean" }).notNull(),
  index: DB.integer({ mode: "number" }).notNull(),
  bug: DB.text({
    enum: AllBugs,
    mode: "text",
  }).notNull(),

  neighbor: DB.text({
    enum: AllBugs,
    mode: "text",
  }),
  cellBorder: DB.integer({
    mode: "number",
  }),
});
