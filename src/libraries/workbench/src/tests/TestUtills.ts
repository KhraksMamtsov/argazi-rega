export function trimNewline(args: TemplateStringsArray) {
  return args.join("").replace(/^[\r\n]+|[\r\n]+$/g, "");
}
