import * as OptionInstances from "@effect/typeclass/data/Option";
import * as RecordInstances from "@effect/typeclass/data/Record";

const traverse = RecordInstances.Traversable.traverse(
  OptionInstances.Applicative
);
