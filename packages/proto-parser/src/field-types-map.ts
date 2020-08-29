import { FieldType } from "./ast-types";

const fieldTypesMap: { [k: string]: FieldType | undefined } = {
  unknown: "unknown",
  message: "message",
  map: "map",
  bool: "bool",
  string: "string",
  bytes: "bytes",
  enum: "enum",
  double: "double",
  float: "float",
  int32: "int32",
  int64: "int64",
  uint32: "uint32",
  uint64: "uint64",
  sint32: "sint32",
  sint64: "sint64",
  fixed32: "fixed32",
  fixed64: "fixed64",
  sfixed32: "sfixed32",
  sfixed64: "sfixed64",
};

export default fieldTypesMap;
