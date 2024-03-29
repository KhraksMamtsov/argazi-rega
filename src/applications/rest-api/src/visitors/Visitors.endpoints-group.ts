import { ApiGroup } from "effect-http";

import { GetVisitorEndpoint } from "./get/GetVisitor.endpoint.js";

export const VisitorsEndpointsGroup = ApiGroup.make("Visitor").pipe(
  ApiGroup.addEndpoint(GetVisitorEndpoint)
);
