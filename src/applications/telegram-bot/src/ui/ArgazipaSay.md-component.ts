import { Effect } from "effect";

import { MD } from "./Markdown.js";

const changeMap = new Map([
	["а", ["@", "α"]],
	["б", ["6"]],
	["в", ["ꞵ", "ẞ", "ß"]],
	["о", ["0", "θ"]],
	["e", ["ε"]],
	["з", ["3"]],
	["ч", ["4"]],
	["р", ["ρ"]],
	["р", ["ρ"]],
	["к", ["κ"]],
	["п", ["π", "η"]],
	["л", ["ʌ", "ㅅ", "人", "𐤂", "∧", "⋀", "⋏", "ለ", "⼊", "λ"]],
	["м", ["μ", "m"]],
	["и", ["υ", "ί", "i"]],
	["ф", ["φ"]],
	["х", ["χ"]],
	["т", ["τ", "t"]],
	["ш", ["ω"]],
]);

export const accentify = (str: string) => {
	const arr = str.split("");

	return arr
		.map((char) => {
			const analogue = changeMap.get(char.toLowerCase());
			if (analogue === undefined) {
				return char;
			}

			return Math.random() > 0.75
				? analogue[Math.floor(Math.random() * analogue.length)] ?? char
				: char;
		})
		.join("");
};

const NBSP = " ";

export const ArgazipaEmotion = {
	INFO: "ℹ️",
};

export const ArgazipaSayMdComponent = (props: {
	emotion: string;
	phrase: string | ReadonlyArray<string>;
}) =>
	Effect.gen(function* (_) {
		return yield* _(
			MD.codeBlock(["🤖", props.emotion].join(NBSP))(
				([] as Array<string>)
					.concat(props.phrase)
					.map((x) => accentify(x))
					.join("\n")
			)
		);
	});
