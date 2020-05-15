import { WebSocket } from "https://deno.land/std@v0.50.0/ws/mod.ts";

export default class Hub {
  public clients: Map<string, WebSocket> = new Map();

  async broadcast(data: string) {
    for (const [key, ws] of this.clients.entries()) {
      try {
        await ws.send(data);
      } catch (err) {
        console.error(`Error sending to: ${key}. ERROR: ${err}`);
        this.clients.delete(key);
      }
    }
  }
}
