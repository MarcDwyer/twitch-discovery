// import fetch from "node-fetch";
// import { Payload, IStreamers } from "./twitch-discovery/twitch-data";
// import { structureData } from "./structure_data";
// import { SubStream } from "./data_types/stream_responses";

// type IData = {
//   _total?: number;
//   streams?: SubStream[];
//   stream?: SubStream;
// };

// async function fetchTwitch(url: string): Promise<IData> {
//   try {
//     const fetchThis = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/vnd.twitchtv.v5+json",
//         "Client-ID": process.env.TWITCH
//       }
//     });
//     const data = await fetchThis.json();
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function fetchStreamData({
//   streamName,
//   channelData,
//   id
// }: IStreamers): Promise<IStreamers> {
//   const url = `https://api.twitch.tv/kraken/streams/${id}`;
//   try {
//     const data = await fetchTwitch(url);
//     if (data["error"]) throw new Error(`error at fetchstreamdata`);
//     return {
//       streamData: data.stream,
//       streamName,
//       channelData,
//       id
//     };
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function fetchTotal(): Promise<number> {
//   const url = `https://api.twitch.tv/kraken/streams/?limit=1&language=en`;
//   try {
//     const data = await fetchTwitch(url);
//     return data._total;
//   } catch (err) {
//     return 2000;
//   }
// }

// async function fetchRandomStreams(totalOffset: number[]): Promise<Payload> {
//   const [skippedOver, total, offset] = totalOffset;
//   const url = `https://api.twitch.tv/kraken/streams/?limit=10&offset=${skippedOver}&language=en`;
//   try {
//     const { streams } = await fetchTwitch(url);
//     return {
//       streams: structureData(streams),
//       online: streams,
//       diagnostic: { skippedOver, offset, total }
//     };
//   } catch (err) {
//     console.log(err);
//   }
// }

// export default { fetchRandomStreams, fetchTotal, fetchStreamData, fetchTwitch };
