import { runMain } from "@effect/platform-node/Runtime";
import * as Schema from "@effect/schema/Schema";
import { Context, Effect, Layer, Logger, LogLevel, pipe } from "effect";
import { Api, NodeServer, RouterBuilder } from "effect-http";
import { PrettyLogger } from "effect-log";

export const debugLogger = pipe(
  PrettyLogger.layer(),
  Layer.merge(Logger.minimumLogLevel(LogLevel.All)),
);

const Lesnek = Schema.struct({ name: Schema.string });

const Standa = Schema.record(
  Schema.string.pipe(Schema.trimmed()),
  Schema.union(
    Schema.Trim.pipe(Schema.description("qweqqqqq")),
    Schema.number.pipe(Schema.greaterThan(5), Schema.lessThan(7), Schema.int()),
  ).pipe(Schema.identifier("Standa"), Schema.description("awesome union")),
).pipe(Schema.identifier("Standa11"));

const HumanSchema = Schema.struct({
  height: Schema.optional(Schema.number, { exact: true }),
  name: Schema.string.pipe(Schema.description("qqq name")),
  asd: Standa.pipe(Schema.description("asd-asd")),
}).pipe(Schema.identifier("Human"));

const StuffService = Context.Tag<{ value: number }>();

const dummyStuff = pipe(
  Effect.succeed({ value: 42 }),
  Layer.effect(StuffService),
);

// Api
const api = pipe(
  Api.api({
    title: "My awesome pets API",
    version: "1.0.0",
    description:
      "This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about\n" +
      "Swagger at [https://swagger.io](https://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!\n" +
      "You can now help us improve the API whether it's by making changes to the definition itself or to the code.\n" +
      "That way, with time, we can improve the API in general, and expose some of the new features in OAS3.\n" +
      "\n" +
      "_If you're looking for the Swagger 2.0/OAS 2.0 version of Petstore, then click [here](https://editor.swagger.io/?url=https://petstore.swagger.io/v2/swagger.yaml). Alternatively, you can load via the `Edit > Load Petstore OAS 2.0` menu option!_\n" +
      "\n" +
      "Some useful links:\n" +
      "- [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)\n" +
      "- [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)",
    license: {
      name: "licenseName",
      url: "licenseUrl",
    },
  }),

  Api.addGroup(
    Api.apiGroup("group", {
      description: "asd",
      externalDocs: {
        url: "qweqweqwe",
        description: "qweqweqweqweqweqweqwe12312",
      },
    }).pipe(
      Api.get(
        "getMilan",
        "/milan",
        {
          response: [
            {
              status: 200,
              content: Schema.string,
            },
            {
              status: 401,
              headers: Schema.struct({
                "X-Client-Id": Schema.string.pipe(Schema.description("qqq2")),
              }),
              content: Schema.string.pipe(
                Schema.description("401 description"),
                Schema.examples(["qwe", "asd", "zxc"]),
              ),
            },
          ],
        },
        {
          description: "test Descri 22 ption",
          summary: "test summary33 22",
        },
      ),
    ),
  ),
  Api.get("getLesnek", "/lesnek/:params2", {
    response: [
      {
        status: 200,
        content: Schema.string.pipe(Schema.description("asdasd qweqwe zxczxc")),
      },
      {
        status: 404,
      },
    ],
    request: {
      params: Schema.struct({ params2: Schema.string }),
      query: Lesnek,
    },
  }),
  Api.get(
    "test",
    "/test",
    {
      response: Standa,
      request: { query: Lesnek },
    },
    {
      description: "descriptiondescriptiondescriptiondescription",
    },
  ),
  Api.post("standa", "/standa", {
    response: Standa,
    request: {
      body: Standa,
    },
  }),
  Api.post("handleMilan", "/petr", {
    response: HumanSchema,
    request: {
      body: HumanSchema,
    },
  }),
  Api.put("callStanda", "/api/zdar", {
    response: {
      status: 200,
      content: Schema.string,
      headers: Schema.struct({
        "X-Client-Id": Schema.string.pipe(Schema.description("qqq2")),
      }),
    },
    request: {
      body: Schema.struct({ zdar: Schema.literal("zdar") }),
    },
  }),
);

const app = pipe(
  RouterBuilder.make(api, { parseOptions: { errors: "all" } }),
  RouterBuilder.handle("handleMilan", ({ body }) =>
    Effect.map(StuffService, ({ value }) => ({
      ...body,
      randomValue: body.height ?? 2 + value,
    })),
  ),
  RouterBuilder.handle("test", ({ query: { name } }) =>
    Effect.succeed({ name }),
  ),
  RouterBuilder.handle("standa", ({ body }) =>
    Effect.succeed({ ...body, standa: "je borec" }),
  ),
  RouterBuilder.handle("getLesnek", (x) => {
    console.log("getLesnek");
    return pipe(
      Effect.succeed({
        status: 200 as const,
        content: `hello22 ${x.query.name}`,
      }),
      Effect.tap(() => Effect.logInfo(x)),
    );
  }),
  RouterBuilder.handle("callStanda", () =>
    Effect.succeed({
      status: 200 as const,
      content: "zdar",
      headers: {
        "x-client-id": "2",
      },
    }),
  ),
  RouterBuilder.handle("getMilan", () =>
    Effect.succeed({ status: 200 as const, content: "test" }),
  ),
);

pipe(
  RouterBuilder.build(app),
  (x) => x,
  NodeServer.listen({ port: 4000 }),
  Effect.provide(dummyStuff),
  Effect.provide(debugLogger),
  runMain,
);
