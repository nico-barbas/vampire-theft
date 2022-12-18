import { Application, Container, AnimatedSprite, Texture } from "pixi.js";

export class Player extends Container {
  app: Application;
  speed: any;
  keys: any;
  acceleration: number;

  constructor(app: Application) {
    super();
    this.app = app;
    const knightFrames = [
      "frames/knight_f_idle_anim_f0.png",
      "frames/knight_f_idle_anim_f1.png",
      "frames/knight_f_idle_anim_f2.png",
      "frames/knight_f_idle_anim_f3.png",
    ];
    const sprite = new AnimatedSprite(
      knightFrames.map((frame) => Texture.from(frame))
    );
    this.position.x = app.screen.width / 2;
    this.position.y = app.screen.height / 2;
    this.speed = {
      x: 0,
      y: 0,
    };
    this.acceleration = 5;
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
    this.keys = {
      right: {
        pressed: false,
      },
      left: {
        pressed: false,
      },
      up: {
        pressed: false,
      },
      down: {
        pressed: false,
      },
    };
    sprite.interactive = true;
    this.addChild(sprite);
    app.ticker.add(() => {
      this.update();
    });
    sprite.onFrameChange = this.onPlayerFrameChange.bind(this);
  }

  update() {
    this.position.y += this.speed.y;
    this.position.x += this.speed.x;

    if (this.keys.right.pressed) {
      this.speed.x = this.acceleration;
    } else if (this.keys.left.pressed) {
      this.speed.x = -this.acceleration;
    } else this.speed.x = 0;

    if (this.keys.up.pressed) {
      this.speed.y = -this.acceleration;
    } else if (this.keys.down.pressed) {
      this.speed.y = this.acceleration;
    } else this.speed.y = 0;
  }

  private onPlayerFrameChange(currentFrame: any): void {
    console.log("Clampy's current frame is", currentFrame);
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
      this.keys.right.pressed = true;
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
      this.keys.left.pressed = true;
    } else if (e.code === "ArrowUp" || e.code === "KeyW") {
      this.keys.up.pressed = true;
    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
      this.keys.down.pressed = true;
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
      this.keys.right.pressed = false;
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
      this.keys.left.pressed = false;
    } else if (e.code === "ArrowUp" || e.code === "KeyW") {
      this.keys.up.pressed = false;
    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
      this.keys.down.pressed = false;
    }
  }
}
