import { Option, ReadonlyArray } from "effect";

export const fromArray = Option.liftPredicate(
	ReadonlyArray.isNonEmptyReadonlyArray
);

export const includes = <T extends X, X>(
	arr: ReadonlyArray<T>,
	element: X
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
): element is T => arr.includes(element as any);
