export class Keyboard {
  keyStates: any;

  constructor() {
    this.keyStates = new Map();
  }

  isKeyDown(...args: Array<String>) {
    let result = false;
    for (let keyCode of args) {
      const event = this.keyStates.get(keyCode);
      console.log(keyCode);
      if (event && !event.wasReleased) result = true;
    }

    return result;
  }
}

const keyboard = new Keyboard();

window.addEventListener(
  "keydown",
  (event) => {
    if (!keyboard.keyStates.get(event.code)) {
      keyboard.keyStates.set(event.code, event);
    }
  },
  false
);
