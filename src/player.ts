import { Application, Container, AnimatedSprite, Texture } from "pixi.js";
import { Vector2 } from "./math";

export class Player extends Container {
  app: Application;
  // We need a proper position field of type Vector2 (the one provided by PixiJS is a dictionary IIRC)
  // to avoid multiple Vector2 allocation every frame caused by getPosition()
  pos: Vector2;
  speed: Vector2;
  keys: Record<string, boolean>;
  idleSprite: AnimatedSprite;
  runningSprite: AnimatedSprite;
  acceleration: number;

  constructor(app: Application) {
    super();
    this.name = "player";
    this.app = app;
    const knightIdleFrames = [
      "frames/knight_m_idle_anim_f0.png",
      "frames/knight_m_idle_anim_f1.png",
      "frames/knight_m_idle_anim_f2.png",
      "frames/knight_m_idle_anim_f3.png",
    ];
    const knightIdleTextures = knightIdleFrames.map((frame) =>
      Texture.from(frame)
    );
    knightIdleTextures.map((texture) => texture.defaultAnchor.set(0.5, 0.5));
    this.idleSprite = new AnimatedSprite(knightIdleTextures);
    const knightRunningFrames = [
      "frames/knight_m_run_anim_f0.png",
      "frames/knight_m_run_anim_f1.png",
      "frames/knight_m_run_anim_f2.png",
      "frames/knight_m_run_anim_f3.png",
    ];
    const knightRunningTextures = knightRunningFrames.map((frame) =>
      Texture.from(frame)
    );
    knightRunningTextures.map((texture) => texture.defaultAnchor.set(0.5, 0.5));
    this.runningSprite = new AnimatedSprite(knightRunningTextures);
    this.pos = new Vector2(app.screen.width / 2, app.screen.height / 2);
    this.position.x = this.pos.x;
    this.position.y = this.pos.y;
    this.speed = new Vector2();
    this.acceleration = 5;
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));

    // We don't need to nest Objects for the keys
    // This is stylistic but results in smaller code aswell
    this.keys = {
      up: false,
      right: false,
      down: false,
      left: false,
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
    // We reset the speed vector every frame
    this.speed.zero();
    this.removeChild(this.runningSprite);
    this.addChild(this.idleSprite);

    // We check each axis in both direction simoulteanously,
    // because it doesn't make sense for the player to be able
    // to move up AND down at the same time
    if (this.keys.up && this.getBounds().y > 0) {
      this.speed.y = -1;
      this.removeChild(this.idleSprite);
      this.addChild(this.runningSprite);
    } else if (
      this.keys.down &&
      this.getBounds().y < window.innerHeight - this.getBounds().height
    ) {
      this.speed.y = 1;
      this.removeChild(this.idleSprite);
      this.addChild(this.runningSprite);
    }

    if (this.keys.left && this.getBounds().x > 0) {
      this.speed.x = -1;
      this.removeChild(this.idleSprite);
      this.addChild(this.runningSprite);
      this.runningSprite.scale.x = -1;
      this.idleSprite.scale.x = -1;
    } else if (
      this.keys.right &&
      this.getBounds().x < window.innerWidth - this.getBounds().width
    ) {
      this.speed.x = 1;
      this.removeChild(this.idleSprite);
      this.addChild(this.runningSprite);
      this.runningSprite.scale.x = 1;
      this.idleSprite.scale.x = 1;
    }

    // We only update the player's position if the speed vector isn't zero
    if (!this.speed.isZero()) {
      // We normalize it and then scale it by the accelaration value
      this.speed.normalizeInPlace().scaleInPlace(this.acceleration);
      this.pos.addInPlace(this.speed);
      this.position.y = this.pos.y;
      this.position.x = this.pos.x;
    }
  }

  // private onPlayerFrameChange(currentFrame: any): void {
  //   console.log("Clampy's current frame is", currentFrame);
  // }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
      this.keys.right = true;
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
      this.keys.left = true;
    } else if (e.code === "ArrowUp" || e.code === "KeyW") {
      this.keys.up = true;
    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
      this.keys.down = true;
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
      this.keys.right = false;
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
      this.keys.left = false;
    } else if (e.code === "ArrowUp" || e.code === "KeyW") {
      this.keys.up = false;
    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
      this.keys.down = false;
    }
  }

  getPosition(): Vector2 {
    return this.pos;
  }
}
