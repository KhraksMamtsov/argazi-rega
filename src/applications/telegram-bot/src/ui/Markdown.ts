import { Effect, Unify, pipe } from "effect";
const SPECIAL_CHARS = [
  "\\",
  "_",
  "*",
  "[",
  "]",
  "(",
  ")",
  "~",
  "`",
  ">",
  "<",
  "&",
  "#",
  "+",
  "-",
  "=",
  "|",
  "{",
  "}",
  ".",
  "!",
];

const escape = (text: string) => {
  SPECIAL_CHARS.forEach((char) => (text = text.replaceAll(char, `\\${char}`)));
  return text;
};

const toEffect = <T, A = never, E = never, R = never>(
  x: T,
  wrap: (x: Exclude<T, Effect.Effect<any, any, any>>) => Effect.Effect<A, E, R>
): Unify.Unify<
  T extends infer X extends Effect.Effect<any, any, any>
    ? X
    : Effect.Effect<A, E, R>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
> => (Effect.isEffect(x) ? x : wrap(x as any)) as any;

const esc = <E = never, R = never>(
  stringsForEscape: TemplateStringsArray,
  ...values: ReadonlyArray<string | Effect.Effect<string, E, R>>
) =>
  Effect.gen(function* (_) {
    let result = "";
    for (let i = 0; i < stringsForEscape.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result += escape(stringsForEscape[i]!);

      if (i < values.length) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result += yield* _(toEffect(values[i]!, Effect.succeed));
      }
    }

    return result;
  });

type DLOptions = {
  readonly lineSeparator?: string;
  readonly prefix?: string;
  readonly separator?: string;
};

const join =
  (separator: string) =>
  (...strings: ReadonlyArray<string>) =>
    strings.join(separator);

const dl =
  (options?: DLOptions) =>
  <E1 = never, R1 = never, E2 = never, R2 = never>(
    ...items: ReadonlyArray<
      [
        dt: string | Effect.Effect<string, E1, R1>,
        dd: string | Effect.Effect<string, E2, R2>,
      ]
    >
  ) => {
    const separator = options?.separator ?? ": ";
    const prefix = options?.prefix ?? "• ";
    const lineSeparator = options?.lineSeparator ?? "\n";

    return Effect.all(
      items.map((item) =>
        Effect.zip(
          toEffect(item[0], Effect.succeed),
          toEffect(item[1], Effect.succeed)
        ).pipe(Effect.map(([dt, dd]) => `${prefix}${dt}${separator}${dd}`))
      )
    ).pipe(Effect.map((x) => x.join(lineSeparator)));
  };

const wrap =
  (brackets: string) =>
  <E = never, R = never>(children: string | Effect.Effect<string, E, R>) =>
    toEffect(children, Effect.succeed).pipe(
      Effect.map((x) => `${brackets}${x}${brackets}`)
    );

const codeBlockWrap = wrap("```");
const underline = wrap("__");

export const MD = {
  bold: wrap("*"),
  br: Effect.succeed(""),
  codeBlock: (language: string) => (code: string) =>
    codeBlockWrap(language + "\n" + code),
  dl,
  document: <E = never, R = never>(
    ...lines: ReadonlyArray<string | Effect.Effect<string, E, R>>
  ) =>
    Effect.all(lines.map((line) => toEffect(line, Effect.succeed))).pipe(
      Effect.map((x) => x.join("\n"))
    ),
  esc,
  escape,
  headline: <E = never, R = never>(
    child: string | Effect.Effect<string, E, R>
  ) => toEffect(child, Effect.succeed),
  inlineCode: wrap("`"),
  italic: wrap("_"),
  join: join,
  line: <E = never, R = never>(
    ...parts: ReadonlyArray<string | Effect.Effect<string, E, R>>
  ) =>
    Effect.all(parts.map((part) => toEffect(part, Effect.succeed))).pipe(
      Effect.map((x) => x.join(""))
    ),
  pipe: pipe,
  spoiler: wrap("||"),
  strikethrough: wrap("~"),
  underline,
  wrap,
};
