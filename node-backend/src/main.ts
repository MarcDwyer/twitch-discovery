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
  const minute = 60000;
  const td = new TwitchDiscovery(io, {
    skipOver: 0,
    incBy: 10,
    refreshEvery: minute * 5,
    getListEvery: minute * 45
  });
  await td.getNewPayload({
    language: "en"
  });
  td.setTimers();

  io.on("connection", socket => socket.emit(BPAYLOAD, td.payload));

  app.post("/set-offset/", async (req, res) =>
    console.log("under construction")
  );

  server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}

main().catch(err => console.log(`Error: ${err}`));
