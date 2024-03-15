import { Api } from "effect-http";

import * as CreateGeoPointEndpoint from "./CreateGeoPoint.endpoint.js";

import { BearerAuth } from "../BearerAuth.security-scheme.js";

export const GeoPointsEndpointGroup = Api.apiGroup("geo-points").pipe(
	Api.post(
		"createGeoPoint",
		"/geo-points",
		{
			request: CreateGeoPointEndpoint.CreateGeoPointRequest,
			response: CreateGeoPointEndpoint.CreateGeoPointResponseSchema,
		},
		{
			security: BearerAuth,
		}
	)
);
