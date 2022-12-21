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
