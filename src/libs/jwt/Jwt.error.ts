import { Data } from "effect";
import JWT from "jsonwebtoken";

export enum JwtErrorType {
	DECODE = "DECODE::JwtErrorType",
	SIGN = "SIGN::JwtErrorType",
	VERIFY = "VERIFY::JwtErrorType",
}

export class JwtSignError extends Data.TaggedError(JwtErrorType.SIGN)<{
	readonly cause: Error;
}> {}
export class JwtVerifyError extends Data.TaggedError(JwtErrorType.VERIFY)<{
	readonly cause: JWT.VerifyErrors;
}> {}
export class JwtDecodeError extends Data.TaggedError(JwtErrorType.DECODE)<{
	readonly cause: Error;
}> {}
