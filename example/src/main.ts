import http from "node:http";

import { App } from "./App";
import { preRender, serve, serveWebSocket } from "aldrin";

const host = "localhost";
const port = 8080;

const renderedApp = preRender(App);

http
  .createServer((req, res) => {
    if (req.url !== "/") {
      res.end();
      return;
    }
    serve(renderedApp, res);
  })
  .listen(port, host, () => {
    console.log(`App started on: http://${host}:${port}`);
  });

serveWebSocket();
