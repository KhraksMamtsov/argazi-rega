import { MD } from "./Markdown.js";

export const EmptyMdComponent = (props: { length: number }) => {
	// eslint-disable-next-line functional/no-try-statements
	try {
		return MD.escape("🐄" + "💨".repeat(props.length - 1));
	} catch {
		return MD.escape("🐄💨");
	}
};
