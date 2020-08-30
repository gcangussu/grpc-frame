import { parseSync } from "@gcangussu/proto-parser";
import { Message } from "@gcangussu/proto-parser/ast-types";

test("scalar values", () => {
  const root = parseSync("protos/scalars.proto");
  expect((root.children.Scalars as Message).fields).toMatchInlineSnapshot(`
    Object {
      "valBool": Object {
        "label": "optional",
        "mapType": null,
        "name": "valBool",
        "number": 13,
        "parentOneof": null,
        "type": "bool",
        "typeName": "",
      },
      "valBytes": Object {
        "label": "optional",
        "mapType": null,
        "name": "valBytes",
        "number": 15,
        "parentOneof": null,
        "type": "bytes",
        "typeName": "",
      },
      "valDouble": Object {
        "label": "optional",
        "mapType": null,
        "name": "valDouble",
        "number": 1,
        "parentOneof": null,
        "type": "double",
        "typeName": "",
      },
      "valFixed32": Object {
        "label": "optional",
        "mapType": null,
        "name": "valFixed32",
        "number": 9,
        "parentOneof": null,
        "type": "fixed32",
        "typeName": "",
      },
      "valFixed64": Object {
        "label": "optional",
        "mapType": null,
        "name": "valFixed64",
        "number": 10,
        "parentOneof": null,
        "type": "fixed64",
        "typeName": "",
      },
      "valFloat": Object {
        "label": "optional",
        "mapType": null,
        "name": "valFloat",
        "number": 2,
        "parentOneof": null,
        "type": "float",
        "typeName": "",
      },
      "valInt32": Object {
        "label": "optional",
        "mapType": null,
        "name": "valInt32",
        "number": 3,
        "parentOneof": null,
        "type": "int32",
        "typeName": "",
      },
      "valInt64": Object {
        "label": "optional",
        "mapType": null,
        "name": "valInt64",
        "number": 4,
        "parentOneof": null,
        "type": "int64",
        "typeName": "",
      },
      "valSfixed32": Object {
        "label": "optional",
        "mapType": null,
        "name": "valSfixed32",
        "number": 11,
        "parentOneof": null,
        "type": "sfixed32",
        "typeName": "",
      },
      "valSfixed64": Object {
        "label": "optional",
        "mapType": null,
        "name": "valSfixed64",
        "number": 12,
        "parentOneof": null,
        "type": "sfixed64",
        "typeName": "",
      },
      "valSint32": Object {
        "label": "optional",
        "mapType": null,
        "name": "valSint32",
        "number": 7,
        "parentOneof": null,
        "type": "sint32",
        "typeName": "",
      },
      "valSint64": Object {
        "label": "optional",
        "mapType": null,
        "name": "valSint64",
        "number": 8,
        "parentOneof": null,
        "type": "sint64",
        "typeName": "",
      },
      "valString": Object {
        "label": "optional",
        "mapType": null,
        "name": "valString",
        "number": 14,
        "parentOneof": null,
        "type": "string",
        "typeName": "",
      },
      "valUint32": Object {
        "label": "optional",
        "mapType": null,
        "name": "valUint32",
        "number": 5,
        "parentOneof": null,
        "type": "uint32",
        "typeName": "",
      },
      "valUint64": Object {
        "label": "optional",
        "mapType": null,
        "name": "valUint64",
        "number": 6,
        "parentOneof": null,
        "type": "uint64",
        "typeName": "",
      },
    }
  `);
});