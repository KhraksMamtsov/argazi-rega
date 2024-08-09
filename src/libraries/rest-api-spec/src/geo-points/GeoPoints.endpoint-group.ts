import { ApiGroup } from "effect-http";

import { CreateGeoPointEndpoint } from "./CreateGeoPoint.endpoint.js";

export const GeoPointsEndpointGroup = ApiGroup.make("Geo point").pipe(
  ApiGroup.addEndpoint(CreateGeoPointEndpoint)
);
