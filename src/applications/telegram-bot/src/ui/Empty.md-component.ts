import { MD } from "./Markdown.js";

export const EmptyMdComponent = (props?: { length?: number }) => {
  const length = props?.length ?? 2;
  // eslint-disable-next-line functional/no-try-statements
  try {
    return MD.escape("🐄" + "💨".repeat(length - 1));
  } catch {
    return MD.escape("🐄💨");
  }
};
