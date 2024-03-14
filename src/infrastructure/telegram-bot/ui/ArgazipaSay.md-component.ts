import { Effect } from "effect";

import { MD } from "./Markdown.js";

import type { NonEmptyReadonlyArray } from "effect/ReadonlyArray";

const changeMap = new Map([
	["а", ["@", "α"]],
	["б", ["6"]],
	["в", ["ꞵ", "ẞ", "ß"]],
	["о", ["0", "θ"]],
	["e", ["ε"]],
	["з", ["3", "z"]],
	["ч", ["4"]],
	["р", ["ρ"]],
	["п", ["π"]],
	["л", ["ʌ", "ㅅ", "人", "𐤂", "∧", "⋀", "⋏", "ለ", "⼊", "λ"]],
	["м", ["μ"]],
	["у", ["υ"]],
	["ф", ["φ"]],
	["х", ["χ"]],
	["т", ["τ"]],
	["т", ["τ"]],
]);

function randomReplace(str: string) {
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
}

const NBSP = " ";

export const ArgazipaEmotion = {
	INFO: "ℹ️",
};

export const ArgazipaSayMdComponent = (props: {
	emotion: string;
	phrase: string;
	tips?: NonEmptyReadonlyArray<string>;
}) =>
	Effect.gen(function* (_) {
		return yield* _(
			MD.codeBlock(["🤖", props.emotion].join(NBSP))(
				randomReplace(props.phrase) +
					(props.tips
						? [
								"\n---",
								...props.tips.map((tip) => "💡 " + randomReplace(tip)),
							].join("\n")
						: "")
			)
		);
	});
