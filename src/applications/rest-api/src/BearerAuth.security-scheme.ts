import { Schema } from "@effect/schema";
import { SecurityScheme } from "effect-http";

export const BearerAuth = {
  bearer: SecurityScheme.bearer({
    bearerFormat: "JWT",
    tokenSchema: Schema.Secret,
  }),
};
