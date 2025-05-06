import * as DB from "drizzle-orm/sqlite-core";
import { Schema } from "effect";
import { Player } from "../../domain/Player.js";

export const _PlayerDb = DB.sqliteTable("Player", {
  id: DB.text().primaryKey().notNull().unique(),
  // nickname: DB.text({ mode: "text" }).notNull(),
});

export class PlayerDbFromSelf extends Schema.Class<PlayerDbFromSelf>(
  "PlayerDbFromSelf"
)({
  id: Schema.String,
  // nickname: Schema.String,
}) {}

PlayerDbFromSelf.Encoded satisfies typeof _PlayerDb.$inferSelect;
PlayerDbFromSelf.Encoded satisfies typeof _PlayerDb.$inferInsert;

export class PlayerDb extends Schema.compose(PlayerDbFromSelf, Player) {
  static _ = _PlayerDb;
}
