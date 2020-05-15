import { serve } from "https://deno.land/std@v0.50.0/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
} from "https://deno.land/std@v0.50.0/ws/mod.ts";
import { v4 } from "https://deno.land/std@v0.50.0/uuid/mod.ts";
import TwitchDiscovery from "./twitch_discovery.ts";
import Hub from "./hub.ts";

import { FPAYLOAD } from "./ws_cases.ts";

// deno run --allow-net --allow-env main.ts
const hub = new Hub();
const td = new TwitchDiscovery(15, hub);
await td.fetchNewPayload();

const s = serve({ port: 5010 });
for await (const req of s) {
  const { conn, r: bufReader, w: bufWriter, headers } = req;

  try {
    const ws = await acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    });
    console.log("connected");

    handleWs(ws);
  } catch (err) {
    console.log(err);
    await req.respond({ status: 400 });
  }
}

async function handleWs(ws: WebSocket) {
  const id = v4.generate();
  hub.clients.set(id, ws);
  ws.send(JSON.stringify({ payload: td.payload, type: FPAYLOAD }));
  try {
    for await (const ev of ws) {
      console.log(ev);
      if (typeof ev === "string") {
        // text message
        console.log("ws:Text", ev);
        await ws.send(ev);
      } else if (ev instanceof Uint8Array) {
        // binary message
        console.log("ws:Binary", ev);
      } else if (isWebSocketPingEvent(ev)) {
        const [, body] = ev;
        // ping
        console.log("ws:Ping", body);
      } else if (isWebSocketCloseEvent(ev)) {
        // close
        // const { code, reason } = ev;
        hub.clients.delete(id);
        console.log(`closed: ${id}`);
      }
    }
  } catch (err) {
    console.error(`failed to receive frame: ${err}`);
    if (!ws.isClosed) {
      await ws.close(1000).catch(console.error).finally(() => {
        console.log(`ws.isClosed: ${id}`);
        hub.clients.delete(id);
      });
    }
  }
}
