import { ApiGroup } from "effect-http";

import { CreateTransportEndpoint } from "./CreateTransport.endpoint.js";

export const TransportsEndpointGroup = ApiGroup.make("transport").pipe(
  ApiGroup.addEndpoint(CreateTransportEndpoint)
);
