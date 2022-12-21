export class SignalDispatcher {
  static signals: Record<string, ((args: any) => void)[]>;
  private static hasInit: boolean = false;

  static addListener(signal: string, callback: (args: any) => void) {
    this.checkInit();
    if (!(signal in this.signals)) {
      this.signals[signal] = new Array();
    }

    this.signals[signal].push(callback);
  }

  static fireSignal(signal: string, args = {}) {
    this.checkInit();
    if (signal in this.signals) {
      this.signals[signal].forEach((callback) => {
        callback(args);
      });
    }
  }

  private static checkInit() {
    if (!this.hasInit) {
      this.signals = {};
      this.hasInit = true;
    }
  }
}
