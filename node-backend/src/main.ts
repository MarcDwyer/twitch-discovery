import { serve } from "https://deno.land/std@v0.50.0/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
} from "https://deno.land/std@v0.50.0/ws/mod.ts";
import { v4 } from "https://deno.land/std@v0.50.0/uuid/mod.ts";
import TwitchDiscovery from "./twitch_discovery.ts";
import Hub from "./hub.ts";

import { FPAYLOAD } from "./ws_cases.ts";

const s = serve({ port: 5010 });

const hub = new Hub();
const td = new TwitchDiscovery(15, hub);
await td.fetchNewPayload();

for await (const req of s) {
  const { conn, r: bufReader, w: bufWriter, headers } = req;
  try {
    const sock = await acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    });
    console.log("socket connected!");
    const id = v4.generate();
    hub.clients.set(id, sock);
    sock.send(JSON.stringify({ type: FPAYLOAD, payload: td.payload }));
    try {
      for await (const ev of sock) {
        if (typeof ev === "string") {
          console.log("Message received: " + ev);
        } else if (ev instanceof Uint8Array) {
          // binary message
          console.log("ws:Binary", ev);
        } else if (isWebSocketPingEvent(ev)) {
          const [, body] = ev;
          // ping
          console.log("ws:Ping", body);
        } else if (isWebSocketCloseEvent(ev)) {
          console.log(ev);
          // close
          const { code, reason } = ev;
          hub.clients.delete(id);
          console.log("ws:Close", code, reason);
        }
      }
    } catch (err) {
      console.error(`failed to receive frame: ${err}`);

      if (!sock.isClosed) {
        hub.clients.delete(id);
        await sock.close(1000).catch(
          console.error,
        );
      }
    }
  } catch (err) {
    console.error(`failed to accept websocket: ${err}`);
    await req.respond({ status: 400 });
  }
}
