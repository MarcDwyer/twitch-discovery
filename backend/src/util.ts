export const fetchTwitch = async (
  url: string,
  client_id: string,
) => {
  try {
    const f = await fetch(url, {
      //@ts-ignore
      headers: {
        "Accept": "application/vnd.twitchtv.v5+json",
        "Client-ID": client_id,
      },
    });
    const results = await f.json();
    return results;
  } catch (err) {
    console.error(err);
    return null;
  }
};
