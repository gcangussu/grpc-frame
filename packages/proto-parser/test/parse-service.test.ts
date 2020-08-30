import { parseSync } from "@gcangussu/proto-parser";
import { Service } from "@gcangussu/proto-parser/ast-types";

test("service", () => {
  const root = parseSync("protos/service.proto");
  expect((root.children.Svc as Service).methods).toMatchInlineSnapshot(`
    Object {
      "BidirectionalStream": Object {
        "clientStreaming": true,
        "inputType": "ReqB",
        "name": "BidirectionalStream",
        "outputType": "ResB",
        "serverStreaming": true,
      },
      "ClientStream": Object {
        "clientStreaming": true,
        "inputType": "ReqC",
        "name": "ClientStream",
        "outputType": "ResC",
        "serverStreaming": false,
      },
      "RequestReply": Object {
        "clientStreaming": false,
        "inputType": "Req",
        "name": "RequestReply",
        "outputType": "Res",
        "serverStreaming": false,
      },
      "ServerStream": Object {
        "clientStreaming": false,
        "inputType": "ReqS",
        "name": "ServerStream",
        "outputType": "ResS",
        "serverStreaming": true,
      },
    }
  `);
});
