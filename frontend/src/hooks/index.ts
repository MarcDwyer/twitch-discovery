import { useState, useEffect } from "react";
import { StreamData } from "../data_types/data_types";

export type PTime = {
  hours: number;
  minutes: number;
  seconds: number;
};

const getTime = (futureTime: number): PTime | null => {
  const now = new Date().getTime();
  if (now >= futureTime) {
    return null;
  }
  const distance = futureTime - now;

  const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

export const useTimer = (futureTime: number) => {
  const [timer, setTimer] = useState<PTime | null>(null);

  useEffect(() => {
    let interval: number;
    setTimer(getTime(futureTime));
    //@ts-ignore
    interval = setInterval(() => setTimer(getTime(futureTime)), 1000);

    return function() {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [futureTime]);

  return timer;
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

export const useAverage = (data: StreamData) => {
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
