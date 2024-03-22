import { Schema } from "@effect/schema";

import { PlaceAdminIdSchema } from "./PlaceAdminId.js";

import { IdPlaceSchema } from "../../place/entity/IdPlace.js";
import { IdUserSchema } from "../../user/entity/IdUser.js";
import { BaseSchema } from "../common/Base.js";

const _PlaceAdminSchema = Schema.struct({
  id: PlaceAdminIdSchema,
  idPlace: IdPlaceSchema,
  idUser: IdUserSchema,
}).pipe(
  //
  Schema.extend(BaseSchema),
  Schema.identifier("PlaceAdminSchema")
);

export type PlaceAdminFrom = Schema.Schema.Encoded<typeof _PlaceAdminSchema>;
export type PlaceAdmin = Schema.Schema.Type<typeof _PlaceAdminSchema>;

export const PlaceAdminSchema: Schema.Schema<PlaceAdmin, PlaceAdminFrom> =
  _PlaceAdminSchema;
