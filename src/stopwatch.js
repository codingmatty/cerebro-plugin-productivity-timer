import EventEmitter from 'events';
import Timer from 'hrstopwatch';


class Stopwatch extends EventEmitter {
  constructor(workTime = 25, restTime = 5) {
    super();

    this.timer = new Timer();
    this.timer.reset();
    this.started = false;
    this.workTime = workTime * 60;
    this.restTime = restTime * 60;
    this.currentPhase = 'work';
  }

  watchTimer(seconds) {
    this.timerWatch = setTimeout(() => {
      const remainingTime = this.getRemainingTime();
      if (remainingTime <= 0) {
        this.emit('complete', this.currentPhase);
        this.reset(this.currentPhase === 'work' ? 'rest' : 'work');
        return;
      }
      this.watchTimer(remainingTime);
    }, (seconds / 2) * 1000);
  }

  start() {
    if (this.started) {
      this.stop();
    }
    this.started = true;
    this.timer.start();

    this.watchTimer(this.getRemainingTime());
  }

  stop() {
    this.started = false;
    this.timer.stop();
    if (this.timerWatch) {
      clearTimeout(this.timerWatch);
    }
  }

  reset(phase = 'work') {
    this.stop();
    this.timer.reset();
    this.currentPhase = phase;
  }

  getElapsedTime() {
    return this.timer.getTime() / 1e9;
  }

  getRemainingTime() {
    const time = this[`${this.currentPhase}Time`];
    return time - this.getElapsedTime()
  }
}


export default Stopwatch;

