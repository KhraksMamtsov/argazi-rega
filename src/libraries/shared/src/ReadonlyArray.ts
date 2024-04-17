import { Option, Array } from "effect";

export const fromArray = Option.liftPredicate(Array.isNonEmptyArray);

export const includes = <T extends X, X>(
  arr: Array<T>,
  element: X
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
): element is T => arr.includes(element as any);
