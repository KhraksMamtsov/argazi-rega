import { Data } from "effect";
import * as RoomId from "./RoomId.ts";
import * as UserId from "./UserId.ts";
import * as Game from "./Game.ts";

export class OpenRoom extends Data.TaggedClass("OpenRoom")<{
  id: RoomId.RoomId;
  ownerId: UserId.UserId;
}> {}

export class ClosedRoom extends Data.TaggedClass("ClosedRoom")<{
  id: RoomId.RoomId;
  ownerId: UserId.UserId;
  opponentId: UserId.UserId;
  game: Game.Game;
}> {}

export type Room = OpenRoom | ClosedRoom;
