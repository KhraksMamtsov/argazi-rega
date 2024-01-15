import { Option, ReadonlyArray } from "effect";

export const fromArray = Option.liftPredicate(
	ReadonlyArray.isNonEmptyReadonlyArray
);
