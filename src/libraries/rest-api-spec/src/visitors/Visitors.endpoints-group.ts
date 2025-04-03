import { HttpApiGroup } from "@effect/platform";
import { GetVisitorEndpoint } from "./get/GetVisitor.endpoint.js";

export class VisitorsEndpointsGroup extends HttpApiGroup.make("Visitor").add(
  GetVisitorEndpoint
) {}
