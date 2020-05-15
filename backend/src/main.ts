import { serve } from "https://deno.land/std/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
} from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import TwitchDiscovery from "./twitch_discovery.ts";
import Hub from "./hub.ts";

import { FPAYLOAD } from "./ws_cases.ts";

const hub = new Hub();
const td = new TwitchDiscovery(15, hub);
await td.fetchNewPayload();

const s = serve({ port: 5010 });
for await (const req of s) {
  const { conn, r: bufReader, w: bufWriter, headers } = req;

  try {
    const sock = await acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    });
    console.log("connected");
    sock.send(JSON.stringify({ payload: td.payload, type: FPAYLOAD }));
    listenWs(sock);
  } catch (err) {
    console.error(err);
  }
}

async function listenWs(ws: WebSocket) {
  for await (const ev of ws) {
    console.log(ev);
  }
}
