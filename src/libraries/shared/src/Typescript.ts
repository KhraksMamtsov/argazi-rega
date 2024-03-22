export type Simplify<T> = {
  readonly [K in keyof T]: T[K];
} & {};

export type DistributiveOmit<T, K extends keyof T> = T extends T
  ? Omit<T, K>
  : never;

export type Tail<T extends ReadonlyArray<unknown>> = T extends readonly [
  any,
  ...infer Tail,
]
  ? Tail
  : never;
