import { ApiGroup } from "effect-http";

import { CreateGeoPointEndpoint } from "./CreateGeoPoint.endpoint.js";

export const GeoPointsEndpointGroup = ApiGroup.make("geo-points").pipe(
  ApiGroup.addEndpoint(CreateGeoPointEndpoint)
);
