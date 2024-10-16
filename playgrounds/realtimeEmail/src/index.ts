import PartySocket from "partysocket";
import http from "node:http";
import WS from "ws";

const ws = new PartySocket({
  host: "localhost:8787",
  room: "random",
  party: "realtime-emails",
  WebSocket: WS,
});

ws.onmessage = (message) => {
  console.log(message.data);
};

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, World!\n");
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
