import http from "http";
import { initWebSocketServer } from "../../src/websocket-utils/initWebSocketServer";

export function startServer(port: number): Promise<http.Server> {
  const server = http.createServer();
  initWebSocketServer(server);

  return new Promise((res) => {
    server.listen(port, () => res(server));
  });
}
