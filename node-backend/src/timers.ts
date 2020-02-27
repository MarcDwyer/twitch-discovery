class Timer {
  time: number;
  interval: number;
  func: Function;
  constructor(func: Function, time: number) {
    this.time = time;
    this.func = func;
    this.interval = setInterval(func, time);
  }
  start() {
    if (!this.interval) {
      this.stop();
      this.interval = setInterval(this.func, this.time);
    }
    return this;
  }
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    return this;
  }
  reset(time?: number) {
    time = time || this.time;
    this.time = time;
    return this.stop().start();
  }
}
export default Timer;
