import * as DB from "drizzle-orm/sqlite-core";

import { sides } from "../../domain/Side.js";
import { PlayerDb } from "./Player.db.js";
import { Schema, hole } from "effect";
import { Match } from "../../domain/Match.js";

export const _MatchDb = DB.sqliteTable("Match", {
  id: DB.text().primaryKey().notNull().unique(),
  idOwner: DB.text({ mode: "text" })
    .notNull()
    .references(() => PlayerDb._.id),
  idOpponent: DB.text({ mode: "text" })
    .notNull()
    .references(() => PlayerDb._.id),
});

export class MatchDbFromSelf extends Schema.Class<MatchDbFromSelf>(
  "MatchDbFromSelf"
)({
  id: Schema.String,
  idOwner: Schema.String,
  idOpponent: Schema.String,
}) {
  static _ = _MatchDb;
}

MatchDbFromSelf.Encoded satisfies typeof _MatchDb.$inferSelect;
MatchDbFromSelf.Encoded satisfies typeof _MatchDb.$inferInsert;

export class MatchDb extends Schema.transform(MatchDbFromSelf, Match, {
  strict: true,
  decode: () => hole(),
  encode: () => hole(),
}) {
  static _ = _MatchDb;
}

export const MatchSettingsDb = DB.sqliteTable("MatchSettings", {
  idMatch: DB.text()
    .notNull()
    .references(() => MatchDb._.id)
    .unique(),
  ownerSide: DB.text({
    enum: sides,
    mode: "text",
  }).notNull(),
  ladybug: DB.integer({ mode: "boolean" }).notNull(),
  pillbug: DB.integer({ mode: "boolean" }).notNull(),
  mosquito: DB.integer({ mode: "boolean" }).notNull(),
});
