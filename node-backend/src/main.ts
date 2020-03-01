import express from "express";
import http from "http";
import ioSetup from "socket.io";
import TwitchDiscovery from "./twitch-discovery/twitch-data";

import bodyParser from "body-parser";
import cors from "cors";
import { BPAYLOAD } from "./data_types/socket_cases";

const app = express(),
  PORT = 5010,
  server = new http.Server(app),
  io = ioSetup(server);

app.use(bodyParser.json());
app.use(cors());

async function main() {
  const minutes = 60000 * 60;
  const streams = new TwitchDiscovery(io, {
    skipOver: 0,
    refreshEvery: minutes * 1,
    getListEvery: minutes * 45
  });
  await streams.getNewPayload();
  // streams.setTimers();

  io.on("connection", socket => socket.emit(BPAYLOAD, streams.payload));

  app.post("/set-offset/", async (req, res) =>
    console.log("under construction")
  );

  server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}

main().catch(err => console.log(`Error: ${err}`));
