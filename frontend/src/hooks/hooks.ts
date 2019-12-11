import { useState, useEffect } from "react";
import { ParentData } from "../data_types/data_types";
import { Time } from "../reducers/timer_reducer";

const getTime = (futureTime: number): Time | null => {
  const now = new Date().getTime();
  if (now >= futureTime) {
    return null;
  }
  const distance = futureTime - now;

  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

export const useTimer = (futureTime: number) => {
  const [timer, setTimer] = useState<Time | null>(null);

  let interval: number | undefined;
  useEffect(() => {
    setTimer(getTime(futureTime));
    //@ts-ignore
    interval = setInterval(() => setTimer(getTime(futureTime)), 60000);

    return function() {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [futureTime]);

  return timer;
};

export const useSocket = (url: string): WebSocket | null => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    if (!socket) {
      setSocket(new WebSocket(url));
    }
  }, [url]);
  return socket;
};

export const usePercentage = (num: number) => {
  const [top, setTop] = useState<string | number>("Calculating percentage...");
  useEffect(() => {
    let top: number | string = num * 100;
    if (top.toString().length >= 3) {
      top = top.toFixed(2);
    }
    top = `${top}%`;
    setTop(top);
  }, [num]);
  return top;
};

export const useAverage = (data: ParentData) => {
  const [avg, setAvg] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const online = Object.values(data).filter(stream => stream.streamData);
      setAvg(() =>
        Math.round(
          online.reduce(
            (num, stream) =>
              stream && stream.streamData
                ? (num += stream.streamData.viewers)
                : 1337,
            0
          ) / online.length
        )
      );
    }
  }, [data]);
  return avg;
};
