import { Application, Container, AnimatedSprite, Texture } from "pixi.js";

export class Player extends Container {
  app: Application;
  speed: any;
  keys: any;
  idleSprite: AnimatedSprite;
  runningSprite: AnimatedSprite;
  acceleration: number;

  constructor(app: Application) {
    super();
    this.app = app;
    const knightIdleFrames = [
      "frames/knight_m_idle_anim_f0.png",
      "frames/knight_m_idle_anim_f1.png",
      "frames/knight_m_idle_anim_f2.png",
      "frames/knight_m_idle_anim_f3.png",
    ];
    this.idleSprite = new AnimatedSprite(
      knightIdleFrames.map((frame) => Texture.from(frame))
    );
    const knightRunningFrames = [
      "frames/knight_m_run_anim_f0.png",
      "frames/knight_m_run_anim_f1.png",
      "frames/knight_m_run_anim_f2.png",
      "frames/knight_m_run_anim_f3.png",
    ];
    this.runningSprite = new AnimatedSprite(
      knightRunningFrames.map((frame) => Texture.from(frame))
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
    this.idleSprite.interactive = true;
    this.runningSprite.interactive = true;
    this.addChild(this.idleSprite);
    app.ticker.add(() => {
      this.update();
    });
    this.idleSprite.animationSpeed = 1 / 6;
    this.idleSprite.play();
    this.runningSprite.animationSpeed = 1 / 6;
    this.runningSprite.play();
    // this.runningSprite.onFrameChange = this.onPlayerFrameChange.bind(this);
  }

  update() {
    this.position.y += this.speed.y;
    this.position.x += this.speed.x;

    if (this.keys.right.pressed) {
      this.speed.x = this.acceleration;
      this.removeChild(this.idleSprite);
      this.addChild(this.runningSprite);
      this.runningSprite.scale.x = 1;
      this.idleSprite.scale.x = 1;
    } else if (this.keys.left.pressed) {
      this.speed.x = -this.acceleration;
      this.removeChild(this.idleSprite);
      this.addChild(this.runningSprite);
      this.runningSprite.scale.x = -1;
      this.idleSprite.scale.x = -1;
    } else {
      this.speed.x = 0;
      this.removeChild(this.runningSprite);
      this.addChild(this.idleSprite);
    }

    if (this.keys.up.pressed) {
      this.speed.y = -this.acceleration;
      this.removeChild(this.idleSprite);
      this.addChild(this.runningSprite);
    } else if (this.keys.down.pressed) {
      this.speed.y = this.acceleration;
      this.removeChild(this.idleSprite);
      this.addChild(this.runningSprite);
    } else {
      this.speed.y = 0;
    }
  }

  // private onPlayerFrameChange(currentFrame: any): void {
  //   console.log("Clampy's current frame is", currentFrame);
  // }

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
