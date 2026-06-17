import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    const message = "It works!\n";
    const version = `NodeJS ${process.versions.node}\n`;
    res.end([message, version].join("\n"));
  },
);

server.listen();
