import { Security } from "effect-http";

export const BearerAuth = Security.bearer({
  bearerFormat: "JWT",
  name: "bearerr",
});
