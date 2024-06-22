import { Schema } from "@effect/schema";

import { IdPlaceAdmin } from "./PlaceAdminId.js";

import { IdPlace } from "../../place/entity/IdPlace.js";
import { IdUser } from "../../user/entity/IdUser.js";
import { Base } from "../common/Base.js";

const _PlaceAdmin = Schema.Struct({
  id: IdPlaceAdmin,
  idPlace: IdPlace,
  idUser: IdUser,
}).pipe(
  //
  Schema.extend(Base),
  Schema.annotations({ identifier: "PlaceAdmin" })
);

export type PlaceAdminFrom = Schema.Schema.Encoded<typeof _PlaceAdmin>;
export type PlaceAdmin = Schema.Schema.Type<typeof _PlaceAdmin>;

export const PlaceAdmin: Schema.Schema<PlaceAdmin, PlaceAdminFrom> =
  _PlaceAdmin;
