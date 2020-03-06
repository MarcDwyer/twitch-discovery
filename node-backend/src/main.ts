import express from "express";
import http from "http";
import ioSetup from "socket.io";
import TwitchDiscovery from "./twitch-discovery/twitch-data";

import bodyParser from "body-parser";
import cors from "cors";
import { BPAYLOAD } from "./data_types/socket_cases";
import { V5TwitchAPI, V5Types } from "twitch-getter";

import dotenv from "dotenv";
import { TDConfig } from "./data_types/td_types";

dotenv.config();

const app = express(),
  PORT = 5010,
  server = new http.Server(app),
  io = ioSetup(server);

app.use(bodyParser.urlencoded());
app.use(cors());

export const tfetcher = new V5TwitchAPI(process.env.TWITCH);

const minute = 60000;

const tdConfig: TDConfig = {
  skipOver: 0,
  incBy: 20,
  refreshEvery: minute * 5,
  getListEvery: minute * 1
};
const twitchConfig: V5Types.V5StreamsConfig = {
  limit: 20,
  language: "en"
};
async function main() {
  const td = new TwitchDiscovery(io, tdConfig, twitchConfig);
  (await td.getNewPayload()).setTimers();

  io.on("connection", socket => socket.emit(BPAYLOAD, td.payload));

  app.get("/set-offset/:offset", async (req, res, next) => {
    res.sendStatus(200);
    return;
    // const offset = parseInt(req.params.offset);
    // const { skipOver } = td.tdConfig;
    // if (!isNaN(offset) && offset !== skipOver) {
    //   await td.changeSkip(offset).getNewPayload(true);
    //   res.sendStatus(200);
    // } else {
    //   next("Data entered is not a number");
    // }
  });

  server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}

main().catch(err => console.log(`Error: ${err}`));
