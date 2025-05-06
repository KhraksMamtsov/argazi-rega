import { Effect, Layer } from "effect";

import { SqlClient } from "@effect/sql";
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import * as SqliteClient from "@effect/sql-sqlite-node/SqliteClient";
import * as D from "drizzle-orm/sqlite-core";

enum Test {
  test = "test",
}

export const test = Effect.log(Test.test);

// setup

const SqlLive = SqliteClient.layer({
  filename: "test.db",
});
const DrizzleLive = SqliteDrizzle.layer.pipe(Layer.provide(SqlLive));
const DatabaseLive = Layer.mergeAll(SqlLive, DrizzleLive);

// usage

const users = D.sqliteTable("users", {
  id: D.integer("id").primaryKey(),
  name: D.text("name"),
});

Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const db = yield* SqliteDrizzle.SqliteDrizzle;
  yield* sql`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)`;
  yield* db.delete(users);
  yield* db.insert(users).values({ id: 1, name: "Alice" });
  const results = yield* db.select().from(users);
  console.log(results);
}).pipe(Effect.provide(DatabaseLive), Effect.runPromise);
