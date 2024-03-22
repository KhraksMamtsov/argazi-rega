import { Either, pipe, Option, Data } from "effect";
import LZString from "lz-string";

export enum ErrorType {
  COMPRESS = "COMPRESS::LzStringErrorType",
  DECOMPRESS = "DECOMPRESS::LzStringErrorType",
}

export class LzStringDecompressError extends Data.TaggedError(
  ErrorType.DECOMPRESS
)<{ readonly cause: unknown; readonly compressed: string }> {}
export class LzStringCompressError extends Data.TaggedError(
  ErrorType.COMPRESS
)<{ readonly cause: unknown; readonly uncompressed: string }> {}

export const decompress = (compressed: string) =>
  pipe(
    Either.try({
      catch: (cause) => new LzStringDecompressError({ cause, compressed }),
      try: () => LZString.decompress(compressed),
    }),
    Either.map(Option.fromNullable)
  );

export const compress = (uncompressed: string) =>
  Either.try({
    catch: (cause) => new LzStringCompressError({ cause, uncompressed }),
    try: () => LZString.compress(uncompressed),
  });
