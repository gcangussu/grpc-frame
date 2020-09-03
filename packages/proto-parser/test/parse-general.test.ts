import { parse } from "@gcangussu/proto-parser";
import {
  Root,
  Namespace,
  Message,
  MessageField,
  Enum,
  Service,
} from "@gcangussu/proto-parser/ast-types";

test("general", async () => {
  const root = await parse("protos/general.proto");

  expect(root).toStrictEqual<Root>({
    kind: "root",
    name: "",
    parent: null,
    children: { foo: expect.any(Object) },
  });

  expect(root.children.foo).toStrictEqual<Namespace>({
    kind: "namespace",
    name: "foo",
    parent: root,
    children: { bar: expect.any(Object) },
  });

  const foo = root.children.foo as Namespace;

  expect(foo.children.bar).toStrictEqual<Namespace>({
    kind: "namespace",
    name: "bar",
    parent: foo,
    children: {
      Bar: expect.any(Object),
      Req: expect.any(Object),
      Res: expect.any(Object),
      Code: expect.any(Object),
    },
  });

  const bar = foo.children.bar as Namespace;
  const Bar = bar.children.Bar as Service;

  expect(Bar).toStrictEqual<Service>({
    kind: "service",
    name: "Bar",
    parent: bar,
    methods: {
      Baz: {
        name: "Baz",
        clientStreaming: false,
        serverStreaming: false,
        inputType: "Req",
        outputType: "Res",
      },
    },
  });

  const Req = bar.children.Req as Message;

  expect(Req).toStrictEqual<Message>({
    kind: "message",
    name: "Req",
    parent: bar,
    fields: {
      yo: expect.any(Object),
      yei: expect.any(Object),
      opt: expect.any(Object),
    },
    oneofs: {},
    children: { Opt: expect.any(Object) },
  });

  expect(Req.fields.yo).toStrictEqual<MessageField>({
    name: "yo",
    label: "optional",
    number: 1,
    type: "message",
    typeName: "Res",
    mapType: null,
    parentOneof: null,
  });

  expect(Req.fields.yei).toStrictEqual<MessageField>({
    name: "yei",
    label: "optional",
    number: 2,
    type: "map",
    typeName: "",
    mapType: ["int32", "string"],
    parentOneof: null,
  });

  expect(Req.fields.opt).toStrictEqual<MessageField>({
    name: "opt",
    label: "optional",
    number: 3,
    type: "enum",
    typeName: "Opt",
    mapType: null,
    parentOneof: null,
  });

  expect(Req.children.Opt).toStrictEqual<Enum>({
    kind: "enum",
    name: "Opt",
    parent: Req,
    values: {
      NO: { name: "NO", number: 0 },
      UNO: { name: "UNO", number: 1 },
    },
  });

  const Res = bar.children.Res as Message;

  expect(Res).toStrictEqual<Message>({
    kind: "message",
    name: "Res",
    parent: bar,
    fields: {
      message: expect.any(Object),
      code: expect.any(Object),
      oi: expect.any(Object),
    },
    oneofs: { testOneof: expect.any(Object) },
    children: { Oi: expect.any(Object) },
  });

  expect(Res.fields.message).toStrictEqual<MessageField>({
    name: "message",
    label: "optional",
    number: 1,
    type: "string",
    typeName: "",
    mapType: null,
    parentOneof: Res.oneofs.testOneof!,
  });

  expect(Res.fields.code).toStrictEqual<MessageField>({
    name: "code",
    label: "optional",
    number: 2,
    type: "enum",
    typeName: "Code",
    mapType: null,
    parentOneof: Res.oneofs.testOneof!,
  });

  expect(Res.fields.oi).toStrictEqual<MessageField>({
    name: "oi",
    label: "optional",
    number: 3,
    type: "message",
    typeName: "Oi",
    mapType: null,
    parentOneof: null,
  });

  expect(Res.children.Oi).toStrictEqual<Message>({
    kind: "message",
    name: "Oi",
    parent: Res,
    fields: {
      status: {
        name: "status",
        label: "repeated",
        number: 1,
        type: "bool",
        typeName: "",
        mapType: null,
        parentOneof: null,
      },
    },
    oneofs: {},
    children: {},
  });
});
