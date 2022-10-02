import net from "node:net";

const server = net
  .createServer((socket) => {
    socket.on("data", (data) => {
      console.log(data.toString());
    });

    socket.write("SERVER: Hello! This is server speaking.");
    socket.end("SERVER: Closing connection now.");
  })
  .on("error", (err) => {
    console.error(err);
  });

export function serveWebSocket(port: number): void {
  server.listen(port, () => {
    console.log("opened server on", port);
  });
}
