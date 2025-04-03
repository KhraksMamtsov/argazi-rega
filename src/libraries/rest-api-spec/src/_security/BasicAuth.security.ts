import { HttpApiMiddleware, HttpApiSecurity } from "@effect/platform";
import {
  UnauthorizedHttpError,
  BasicAuthenticatedSession,
} from "./Security.common.js";

export class BasicAuthentication extends HttpApiMiddleware.Tag<BasicAuthentication>()(
  "BasicAuthentication",
  {
    failure: UnauthorizedHttpError,
    provides: BasicAuthenticatedSession,
    security: {
      authBasic: HttpApiSecurity.basic,
    },
  }
) {}
