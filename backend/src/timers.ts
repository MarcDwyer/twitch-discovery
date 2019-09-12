
export interface ITimer {
    interval: number;
    func: Function;
    time: number;
    start(): ITimer;
    stop(): ITimer;
    reset(param: number): void;
}
 function Timer(this: ITimer, func: Function, time: number) {
    this.func = func
    this.time = time
    this.interval = setInterval(this.func, this.time)
}


Timer.prototype.start = function () {
    if (!this.interval) {
        this.stop()
        this.interval = setInterval(this.func, this.time)
    }
    return this
}

Timer.prototype.stop = function () {
    if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
    }
    return this
}

Timer.prototype.reset = function (time) {
    this.time = time
    return this.stop().start()
}

export default Timer