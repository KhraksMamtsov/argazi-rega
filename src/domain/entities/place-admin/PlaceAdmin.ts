import { Schema } from "@effect/schema";
import { BaseSchema } from "../common/Base.js";
import { PlaceAdminIdSchema } from "./PlaceAdminId.js";
import { UserIdSchema } from "../user/UserId.js";
import { PlaceIdSchema } from "../place/PlaceId.js";

const _PlaceAdminSchema = Schema.struct({
  id: PlaceAdminIdSchema,
  idUser: UserIdSchema,
  idPlace: PlaceIdSchema,
}).pipe(
  //
  Schema.extend(BaseSchema),
  Schema.identifier("PlaceAdminSchema"),
);

export interface PlaceAdminFrom
  extends Schema.Schema.From<typeof _PlaceAdminSchema> {}
export interface PlaceAdmin
  extends Schema.Schema.To<typeof _PlaceAdminSchema> {}

export const PlaceAdminSchema: Schema.Schema<PlaceAdminFrom, PlaceAdmin> =
  _PlaceAdminSchema;
