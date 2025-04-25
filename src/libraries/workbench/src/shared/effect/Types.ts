export type Distributive<
  I extends ReadonlyArray<any>,
  Result extends ReadonlyArray<any> = [],
> = I extends readonly [infer T, ...infer Rest extends ReadonlyArray<any>]
  ? [T] extends [never]
    ? Distributive<Rest, [...Result, T]>
    : T extends infer TMember
      ? Distributive<Rest, [...Result, TMember]>
      : never
  : Result;

export const distributive = <const T extends ReadonlyArray<any>>(
  value: T
): Distributive<T> => {
  return value as any as Distributive<T>;
};

export type AssertTrue<T extends true> = T;

export type IsExtends<Actual, Expected> = [Actual] extends [Expected]
  ? true
  : false;
