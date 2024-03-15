import { Api } from "effect-http";

import * as CreateTransportEndpoint from "./CreateTransport.endpoint.js";

export const TransportsEndpointGroup = Api.apiGroup("transport").pipe(
	Api.post("createTransport", "/transports", {
		request: CreateTransportEndpoint.CreateTransportRequest,
		response: CreateTransportEndpoint.CreateTransportResponseSchema,
	})
);
