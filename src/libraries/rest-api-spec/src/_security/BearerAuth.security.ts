import { HttpApiMiddleware, HttpApiSecurity, OpenApi } from "@effect/platform";
import {
  UnauthorizedHttpError,
  BearerAuthenticatedSession,
} from "./Security.common.js";

export class BearerAuthentication extends HttpApiMiddleware.Tag<BearerAuthentication>()(
  "BearerAuthentication",
  {
    failure: UnauthorizedHttpError,
    provides: BearerAuthenticatedSession,
    security: {
      authBearer: HttpApiSecurity.bearer.pipe(
        HttpApiSecurity.annotate(OpenApi.Format, "jwt")
      ),
    },
  }
) {}
