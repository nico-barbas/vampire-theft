export class Timer {
  static readonly ANIMATION_SPEED = 1 / 6;

  duration: number;
  tick: number = 0;

  constructor(duration: number) {
    this.duration = duration;
  }

  advance(): boolean {
    this.tick += 1;
    if (this.tick >= this.duration) {
      this.tick = 0;
      return true;
    }

    return false;
  }

  // FIXME: Currently this assumes that the game is always running at 60fps
  static secondsToTick(seconds: number): number {
    return seconds * 60;
  }
}

export class Stat {
  name: string;
  current: number;
  max: number;

  constructor(name: string, max: number) {
    this.name = name;
    this.current = max;
    this.max = max;
  }

  setCurrent(n: number) {
    this.current = Math.min(Math.max(n, 0), this.max);
  }

  increase(by: number) {
    this.current = Math.min(this.current + by, this.max);
  }

  decrease(by: number) {
    this.current = Math.max(this.current - by, 0);
  }

  atMax(): boolean {
    return this.current === this.max;
  }
}
