export type Kind = "root" | "namespace" | "service" | "message" | "enum";

interface Node {
  readonly kind: Kind;
  readonly name: string;
  readonly parent: Node | null;
  readonly children?: { readonly [k: string]: Node | undefined };
}

type LeafNode = Omit<Node, "children">;

export interface Root extends Node {
  readonly kind: "root";
  readonly name: "";
  readonly parent: null;
  readonly children: {
    readonly [k: string]: Namespace | Message | Enum | Service | undefined;
  };
}

export interface Namespace extends Node {
  readonly kind: "namespace";
  readonly parent: Root | Namespace;
  readonly children: {
    readonly [k: string]: Namespace | Message | Enum | Service | undefined;
  };
}

export interface Message extends Node {
  readonly kind: "message";
  readonly parent: Root | Namespace | Message;
  readonly children: { readonly [k: string]: Message | Enum | undefined };
  readonly fields: { readonly [k: string]: MessageField | undefined };
  readonly oneofs: { readonly [k: string]: MessageOneof | undefined };
}

export interface MessageField {
  readonly name: string;
  readonly number: number;
  readonly label: FieldLabel;
  readonly type: FieldType;
  readonly typeName: string;
  readonly mapType: readonly [MapKeyType, string] | null;
  readonly parentOneof: MessageOneof | null;
}

export interface MessageOneof {
  readonly name: string;
  readonly fields: { readonly [k: string]: MessageField | undefined };
}

export interface WritableMessageOneof {
  name: string;
  fields: { [k: string]: MessageField | undefined };
}

export type FieldLabel = "optional" | "required" | "repeated";

export type FieldType =
  | "unknown"
  | "message"
  | "map"
  | "bool"
  | "string"
  | "bytes"
  | "enum"
  | "double"
  | "float"
  | "int32"
  | "int64"
  | "uint32"
  | "uint64"
  | "sint32"
  | "sint64"
  | "fixed32"
  | "fixed64"
  | "sfixed32"
  | "sfixed64";

export type MapKeyType =
  | "bool"
  | "string"
  | "int32"
  | "int64"
  | "uint32"
  | "uint64"
  | "sint32"
  | "sint64"
  | "fixed32"
  | "fixed64"
  | "sfixed32"
  | "sfixed64";

export interface Service extends LeafNode {
  readonly kind: "service";
  readonly parent: Root | Namespace;
  readonly methods: { readonly [k: string]: Method | undefined };
}

export interface Method {
  readonly name: string;
  readonly clientStreaming: boolean;
  readonly serverStreaming: boolean;
  readonly inputType: string;
  readonly outputType: string;
}

export interface Enum extends LeafNode {
  readonly kind: "enum";
  readonly parent: Root | Namespace | Message;
  readonly values: { readonly [k: string]: EnumValue | undefined };
}

export interface EnumValue {
  readonly name: string;
  readonly number: number;
}

type Children<T extends Node> = T["children"][keyof T["children"]];

type WritableNode<T extends Node> = {
  -readonly [K in keyof T]: K extends "children"
    ? { [k: string]: Children<T> }
    : T[K];
};

export interface WritableRoot extends WritableNode<Root> {}
export interface WritableNamespace extends WritableNode<Namespace> {}
export interface WritableMessage extends WritableNode<Message> {}
