import protobuf from "protobufjs";

import fieldTypesMap from "./field-types-map.js";
import type {
  Enum,
  EnumValue,
  FieldLabel,
  FieldType,
  MapKeyType,
  Message,
  MessageField,
  MessageOneof,
  Method,
  Namespace,
  Root,
  Service,
  WritableMessage,
  WritableMessageOneof,
  WritableNamespace,
  WritableRoot,
} from "./ast-types";

export async function parse(path: string): Promise<Root> {
  const pbRoot = await protobuf.load(path);
  return processRoot(pbRoot);
}

export function parseSync(path: string): Root {
  const pbRoot = protobuf.loadSync(path);
  return processRoot(pbRoot);
}

function processRoot(pbRoot: protobuf.Root): Root {
  pbRoot.resolveAll();

  const root: WritableRoot = {
    kind: "root",
    name: "",
    parent: null,
    children: {},
  };

  for (const child of pbRoot.nestedArray) {
    root.children[child.name] = processNamespaceChild(root, child);
  }

  return root;
}

function processNamespaceChild(
  parent: Root | Namespace,
  obj: protobuf.ReflectionObject
): Namespace | Service | Message | Enum {
  if (obj instanceof protobuf.Enum) {
    return processEnum(parent, obj);
  } else if (obj instanceof protobuf.Service) {
    return processService(parent, obj);
  } else if (obj instanceof protobuf.Type) {
    return processMessage(parent, obj);
  } else if (obj instanceof protobuf.Namespace) {
    return processNamespace(parent, obj);
  } else {
    throw new Error(`Unexpected instance of '${obj.constructor.name}'`);
  }
}

function processNamespace(
  parent: Root | Namespace,
  obj: protobuf.Namespace
): Namespace {
  const namespace: WritableNamespace = {
    kind: "namespace",
    name: obj.name,
    parent,
    children: {},
  };

  for (const child of obj.nestedArray) {
    namespace.children[child.name] = processNamespaceChild(namespace, child);
  }

  return namespace;
}

function processService(
  parent: Root | Namespace,
  obj: protobuf.Service
): Service {
  const methodsObj: { [k: string]: Method } = {};

  for (const method of obj.methodsArray) {
    const {
      name,
      requestStream = false,
      responseStream = false,
      requestType,
      responseType,
    } = method;

    methodsObj[name] = {
      name,
      clientStreaming: requestStream,
      serverStreaming: responseStream,
      inputType: requestType,
      outputType: responseType,
    };
  }

  return {
    kind: "service",
    name: obj.name,
    parent,
    methods: methodsObj,
  };
}

type ProtobufField = protobuf.Field | protobuf.MapField;
type ProtobufFieldsArray = readonly ProtobufField[];

function processMessage(
  parent: Root | Namespace | Message,
  obj: protobuf.Type
): Message {
  const fieldsObj: { [k: string]: MessageField } = {};
  const oneofsObj: { [k: string]: WritableMessageOneof | undefined } = {};

  for (const oneof of obj.oneofsArray) {
    oneofsObj[oneof.name] = { name: oneof.name, fields: {} };
  }

  for (const field of obj.fieldsArray as ProtobufFieldsArray) {
    const wipField = processField(field);
    const parentOneof = getOneof(oneofsObj, wipField.parentOneof);
    const finalField: MessageField = { ...wipField, parentOneof };

    if (parentOneof != null) {
      if (parentOneof.fields[finalField.name] != null)
        throw new Error(
          `Field '${finalField.name}' was already in oneof '${parentOneof.name}'`
        );
      parentOneof.fields[finalField.name] = finalField;
    }

    fieldsObj[finalField.name] = finalField;
  }

  const message: WritableMessage = {
    kind: "message",
    name: obj.name,
    parent,
    children: {},
    fields: fieldsObj,
    oneofs: oneofsObj,
  };

  for (const child of obj.nestedArray) {
    message.children[child.name] = processMessageChild(message, child);
  }

  return message;
}

function processField(field: ProtobufField) {
  const { name, id, repeated, optional, partOf } = field;

  const label: FieldLabel = repeated
    ? "repeated"
    : optional
    ? "optional"
    : "required";

  const type = getType(field);
  const typeName = type === "message" || type === "enum" ? field.type : "";

  return {
    name,
    number: id,
    label,
    type,
    typeName,
    mapType: getMapType(type, field),
    parentOneof: partOf != null ? partOf.name : "",
  };
}

function getType(field: ProtobufField): FieldType {
  if (field.resolvedType instanceof protobuf.Enum) return "enum";
  if (field.resolvedType instanceof protobuf.Type) return "message";
  if (field.map) return "map";

  const type = fieldTypesMap[field.type];
  if (type == null) throw new Error(`Unknown type '${field.type}'`);

  return type;
}

function getMapType(
  type: FieldType,
  field: ProtobufField
): readonly [MapKeyType, string] | null {
  if (type !== "map") return null;

  if (!(field instanceof protobuf.MapField))
    throw Error("Inconsistent pair of type and field");

  return [field.keyType as MapKeyType, field.type];
}

function getOneof<T extends MessageOneof>(
  oneofsObj: { [k: string]: T | undefined },
  name: string
): T | null {
  if (name.length === 0) return null;

  const oneof = oneofsObj[name];
  if (oneof == null) throw new Error(`Couldn't find oneof '${name}'`);

  return oneof;
}

function processMessageChild(
  parent: Message,
  obj: protobuf.ReflectionObject
): Message | Enum {
  if (obj instanceof protobuf.Enum) {
    return processEnum(parent, obj);
  } else if (obj instanceof protobuf.Type) {
    return processMessage(parent, obj);
  } else {
    throw new Error(`Unexpected instance of '${obj.constructor.name}'`);
  }
}

function processEnum(
  parent: Root | Namespace | Message,
  obj: protobuf.Enum
): Enum {
  const valuesObj: { [k: string]: EnumValue } = {};

  for (const [name, number] of Object.entries(obj.values)) {
    valuesObj[name] = { name, number };
  }

  return {
    kind: "enum",
    name: obj.name,
    parent,
    values: valuesObj,
  };
}
