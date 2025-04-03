import { Args, Command } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Path, FileSystem as FS } from "@effect/platform";
import { Effect, Stream } from "effect";
import { Schema } from "effect";

const StatsContract = Schema.Struct({
  chars: Schema.Number,
  lines: Schema.Number,
  words: Schema.Number,
});

const encodeStatsContractToJSON = Schema.encodeEither(
  Schema.parseJson(StatsContract)
);

const calculateStats = (path: string) =>
  Effect.gen(function* () {
    const fs = yield* FS.FileSystem;

    return yield* fs.stream(path).pipe(
      Stream.decodeText("utf8"),
      Stream.flatMap((x) => Stream.fromIterable(x.split(""))),
      Stream.runFold({ lines: 0, words: 0, chars: 0 }, (acc, cur) => ({
        chars: acc.chars + 1,
        lines: acc.lines + (cur === "\n" ? 1 : 0),
        words: acc.words + (cur === " " ? 1 : 0),
      }))
    );
  });

const pathArg = Args.file({ exists: "yes" }).pipe(
  Args.withDescription("Path to file")
);

const reportSubCommand = Command.make("report", { pathArg }, (x) =>
  Effect.gen(function* () {
    const fs = yield* FS.FileSystem;
    const path = yield* Path.Path;

    const stats = yield* calculateStats(x.pathArg);

    const cwd = path.resolve();
    const statsPath = path.join(cwd, "stats.json");
    const data = yield* encodeStatsContractToJSON(stats);

    yield* fs.writeFileString(statsPath, data);
  })
);

const printSubCommand = Command.make("print", { pathArg }, (x) =>
  Effect.gen(function* () {
    const stats = yield* calculateStats(x.pathArg);
    yield* Effect.log(stats);
  })
);

const appCommand = Command.make("app").pipe(
  Command.withDescription("Node Kata solution"),
  Command.withSubcommands([reportSubCommand, printSubCommand])
);

const cli = Command.run(appCommand, {
  name: "Node Kata",
  version: "0.0.1",
});

const program = cli(process.argv).pipe(Effect.provide(NodeContext.layer));

NodeRuntime.runMain(program);
