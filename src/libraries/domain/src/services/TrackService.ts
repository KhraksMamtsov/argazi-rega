interface LogItem<T, K extends keyof T, B extends T[K]> {
  readonly before: T;
  readonly from: T[K];
  readonly key: K;
  readonly to: B;
}

interface ChangeResult<T, K extends keyof T, B extends T[K]> {
  readonly log: ReadonlyArray<LogItem<T, K, B>>;
  readonly result: T;
}

export const change =
  <T, K extends keyof T, B extends T[K]>(
    key: K,
    changer: (value: T[K], entity: T) => B
  ) =>
  (entity: T): ChangeResult<T, K, B> => {
    const value = entity[key];
    const newValue = changer(entity[key], entity);

    return {
      log: [
        {
          before: entity,
          from: value,
          key,
          to: newValue,
        },
      ],
      result: { ...entity, [key]: newValue },
    };
  };
