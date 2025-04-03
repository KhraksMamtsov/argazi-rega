import { BearerAuthentication } from "../_security/BearerAuth.security.js";
import { CreateGeoPointEndpoint } from "./CreateGeoPoint.endpoint.js";
import { HttpApiGroup } from "@effect/platform";

export const GeoPointsEndpointGroup = HttpApiGroup.make("GeoPoint")
  .add(CreateGeoPointEndpoint)
  .middleware(BearerAuthentication);
