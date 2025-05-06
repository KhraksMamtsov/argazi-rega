import * as DB from "drizzle-orm/sqlite-core";
import { AllBugs, BugStr } from "../../api/Bug.str.js";
import { Effect, Match, Option, ParseResult, Schema } from "effect";

import { MatchDb } from "./Match.db.js";
import { CellBorderSchema } from "../../domain/CellBorder.js";

import * as GameMove from "../../domain/GameMove.js";
import { MatchTag } from "../../domain/Match.js";

export const _GameMoveDb = DB.sqliteTable("GameMove", {
  idMatch: DB.text({ mode: "text" })
    .notNull()
    .references(() => MatchDb._.id),
  side: DB.integer({ mode: "boolean" }).notNull(),
  index: DB.integer({ mode: "number" })
    .primaryKey({ autoIncrement: true })
    .notNull(),
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

export class GameMoveDbFromSelfSelect extends Schema.Class<GameMoveDbFromSelfSelect>(
  "GameMoveDbFromSelfSelect"
)({
  idMatch: Schema.String,
  index: Schema.Number,
  bug: BugStr,
  side: Schema.transformLiterals([false, "black"], [true, "white"]),
  neighbor: Schema.OptionFromNullOr(BugStr),
  cellBorder: Schema.OptionFromNullOr(
    Schema.Number.pipe(Schema.compose(CellBorderSchema))
  ),
}) {
  static _ = _GameMoveDb;
}

// const qwe = Schema.Number.pipe(Schema.compose(CellBorderSchema));

GameMoveDbFromSelfSelect.Encoded satisfies typeof _GameMoveDb.$inferSelect;

export class GameMoveDbSelect extends Schema.transformOrFail(
  GameMoveDbFromSelfSelect,
  Schema.typeSchema(GameMove.GameMove),
  {
    strict: true,
    decode: Effect.fn("MoveDb.decode")(function* (fromA, _, ast) {
      return yield* Match.value([fromA.cellBorder, fromA.neighbor]).pipe(
        Match.when([Option.isSome, Option.isSome], ([cellBorder, neighbor]) =>
          ParseResult.succeed(
            new GameMove.BugGameMove({
              cellBorder: cellBorder.value,
              neighbor: neighbor.value,
              bug: fromA.bug,
              side: fromA.side,
            })
          )
        ),
        Match.when([Option.isNone, Option.isNone], () => {
          if (fromA.side === "white") {
            return ParseResult.succeed(
              new GameMove.InitialGameMove({
                bug: fromA.bug,
                side: fromA.side,
              })
            );
          } else {
            return ParseResult.fail(
              new ParseResult.Type(
                ast,
                fromA.side,
                "Initial step must be done by white side."
              )
            );
          }
        }),
        Match.orElse(() =>
          ParseResult.fail(
            new ParseResult.Type(
              ast,
              fromA.side,
              "cellBorder and neighbor have to be both Some, or None at the same."
            )
          )
        )
      );
    }),
    encode: (x, _, ast) =>
      ParseResult.fail(
        new ParseResult.Forbidden(
          ast,
          x,
          "Encoding GameMove back to GameMoveDb is forbidden."
        )
      ),
  }
).annotations({
  identifier: "GameMoveDbSelect",
}) {
  static _ = _GameMoveDb;
}

export class GameMoveDbFromSelfInsert extends Schema.Class<GameMoveDbFromSelfInsert>(
  "GameMoveDbFromSelfInsert"
)({
  idMatch: Schema.String,
  index: Schema.optionalWith(Schema.Number, {
    as: "Option",
  }),
  bug: BugStr,
  side: Schema.transformLiterals([false, "black"], [true, "white"]),
  neighbor: Schema.optionalWith(BugStr, {
    as: "Option",
    nullable: true,
  }),
  cellBorder: Schema.optionalWith(CellBorderSchema, {
    as: "Option",
    nullable: true,
  }),
}) {}

GameMoveDbFromSelfInsert.Encoded satisfies typeof _GameMoveDb.$inferInsert;

export class GameMoveDbInsert extends Schema.transformOrFail(
  GameMoveDbFromSelfInsert,
  Schema.typeSchema(GameMove.GameMove),
  {
    strict: true,
    decode: (x, _, ast) =>
      ParseResult.fail(
        new ParseResult.Forbidden(
          ast,
          x,
          "Decoding GameMove from GameMoveDbFromSelfInsert is forbidden."
        )
      ),
    encode: Effect.fn("GameMoveDbInsert.encode")(function* (x) {
      const match = yield* MatchTag;

      return yield* ParseResult.succeed(
        new GameMoveDbFromSelfInsert({
          idMatch: match.id,
          bug: x.bug,
          index: Option.none(),
          neighbor:
            x._tag === "BugGameMove" ? Option.some(x.neighbor) : Option.none(),
          cellBorder:
            x._tag === "BugGameMove"
              ? Option.some(x.cellBorder)
              : Option.none(),
          side: x.side,
        })
      );
    }),
  }
).annotations({
  identifier: "GameMoveDbInsert",
}) {
  static _ = _GameMoveDb;
}
