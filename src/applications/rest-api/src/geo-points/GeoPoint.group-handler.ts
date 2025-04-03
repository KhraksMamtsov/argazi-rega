import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { CreateGeoPointHandlerLive } from "./CreateGeoPoint.handler.js";

export const GeoPointGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "GeoPoint",
  (handlers) => handlers.handle("createGeoPoint", CreateGeoPointHandlerLive)
);
