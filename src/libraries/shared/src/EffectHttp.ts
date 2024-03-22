import { Option } from "effect";

export type Optionize<T> = {
  readonly [K in keyof T]: Option.Option<T[K]>;
};
