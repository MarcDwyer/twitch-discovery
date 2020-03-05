import express from "express";
import http from "http";
import ioSetup from "socket.io";
import TwitchDiscovery from "./twitch-discovery/twitch-data";

import bodyParser from "body-parser";
import cors from "cors";
import { BPAYLOAD } from "./data_types/socket_cases";
import { V5TwitchAPI, V5Types } from "twitch-getter";

import dotenv from "dotenv";

dotenv.config();

const app = express(),
  PORT = 5010,
  server = new http.Server(app),
  io = ioSetup(server);
app.use(bodyParser.urlencoded());
app.use(cors());

export const tfetcher = new V5TwitchAPI(process.env.TWITCH);

async function main() {
  const minute = 60000;
  const tdConfig = {
    skipOver: 0,
    incBy: 10,
    refreshEvery: minute * 5,
    getListEvery: minute * 45
  };

  const td = new TwitchDiscovery(io, tdConfig);
  await td.getNewPayload({
    language: "en"
  });
  td.setTimers();

  io.on("connection", socket => socket.emit(BPAYLOAD, td.payload));

  app.get("/set-offset/:offset", async (req, res, next) => {
    const offset = parseInt(req.params.offset);
    if (!isNaN(offset)) {
      td.tdConfig.skipOver = offset;
      await td.getNewPayload({
        language: "en"
      });
      res.send(200);
    } else {
      next("Data entered is not a number");
    }
  });

  server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}

main().catch(err => console.log(`Error: ${err}`));
