import * as DB from "drizzle-orm/sqlite-core";

import { sides } from "../../domain/Side.js";
import { PlayerDb } from "./Player.db.js";
import { Effect, ParseResult, Schema } from "effect";
import {
  Invite,
  InviteSettings,
  InviteSettingsTag,
} from "../../domain/Invite.js";

export const _InviteDb = DB.sqliteTable("Invite", {
  id: DB.text({}).primaryKey().notNull().unique(),
  idOwner: DB.text({ mode: "text" })
    .notNull()
    .references(() => PlayerDb._.id),
});

export class InviteDbFromSelf extends Schema.Class<InviteDbFromSelf>(
  "InviteDbFromSelf"
)({
  id: Schema.String,
  idOwner: Schema.String,
}) {
  static _ = _InviteDb;
}

InviteDbFromSelf.Encoded satisfies typeof _InviteDb.$inferSelect;
InviteDbFromSelf.Encoded satisfies typeof _InviteDb.$inferInsert;

export class InviteDb extends Schema.transformOrFail(InviteDbFromSelf, Invite, {
  strict: true,
  decode: (s) =>
    Effect.gen(function* () {
      const settings = yield* InviteSettingsTag;
      return {
        id: s.id,
        owner: { id: s.idOwner },
        settings: settings,
      };
    }),
  encode: (x, _, ast) =>
    ParseResult.fail(
      new ParseResult.Forbidden(
        ast,
        x,
        "Encoding InviteSettings back to InviteSettingsDb is forbidden."
      )
    ),
}) {
  static _ = _InviteDb;
  static decode = Schema.decode(this);
}

export const _InviteSettingsDb = DB.sqliteTable("InviteSettings", {
  idInvite: DB.text()
    .notNull()
    .references(() => InviteDb._.id)
    .unique(),
  ownerSide: DB.text({
    enum: [...sides, "random"],
    mode: "text",
  }).notNull(),
  ladybug: DB.integer({ mode: "boolean" }).notNull(),
  pillbug: DB.integer({ mode: "boolean" }).notNull(),
  mosquito: DB.integer({ mode: "boolean" }).notNull(),
});

export class InviteSettingsDbFromSelf extends Schema.Class<InviteSettingsDbFromSelf>(
  "InviteSettingsDbFromSelf"
)({
  idInvite: Schema.String,
  ownerSide: Schema.Literal("white", "black", "random"),
  mosquito: Schema.Boolean,
  ladybug: Schema.Boolean,
  pillbug: Schema.Boolean,
}) {
  static _ = _InviteSettingsDb;
}

InviteSettingsDbFromSelf.Encoded satisfies typeof _InviteSettingsDb.$inferSelect;
InviteSettingsDbFromSelf.Encoded satisfies typeof _InviteSettingsDb.$inferInsert;

export class InviteSettingsDb extends Schema.transformOrFail(
  InviteSettingsDbFromSelf,
  InviteSettings,
  {
    strict: true,
    decode: (s) =>
      ParseResult.succeed({
        matchMode: {
          ladybug: s.ladybug,
          mosquito: s.mosquito,
          pillbug: s.pillbug,
        },
        ownerSide: s.ownerSide,
      }),
    // encode: Effect.fn(function* (s) {
    //   const invite = yield* InviteTag;
    //   return new InviteSettingsDbFromSelf({
    //     idInvite: invite.id,
    //     ladybug: s.matchMode.ladybug,
    //     mosquito: s.matchMode.mosquito,
    //     pillbug: s.matchMode.pillbug,
    //     ownerSide: s.ownerSide,
    //   });
    // }),

    encode: (x, _, ast) =>
      ParseResult.fail(
        new ParseResult.Forbidden(
          ast,
          x,
          "Encoding InviteSettings back to InviteSettingsDb is forbidden."
        )
      ),
  }
) {
  static decode = Schema.decode(this);
  static _ = _InviteSettingsDb;
}
