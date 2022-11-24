import http from "node:http";

import { App } from "./App";
import { renderPage, serveWebSocket } from "aldrin";

const host = "localhost";
const port = 8080;

http
  .createServer((req, res) => {
    if (req.url !== "/") {
      res.end();
      return;
    }
    renderPage(App, res);
  })
  .listen(port, host, () => {
    console.log(`App started on: http://${host}:${port}`);
  });

serveWebSocket();
