import {
  Application,
  Container,
  AnimatedSprite,
  Assets,
  Sprite,
  Texture,
} from "pixi.js";
import { Vector2, Rectangle } from "./math";
import { PhysicsBody, PhysicsContext } from "./physics";
import { SignalDispatcher } from "./signals";
import { Stat, Timer } from "./utils";
import { Gun } from "./gun";

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
  bodyBounds: Rectangle;

  private readonly HP_BAR_HEIGHT = 6;
  hpBackground: Sprite;
  hpFill: Sprite;

  // All the systems related data
  level: number;
  xp: Stat;
  health: Stat;
  recentHit: boolean = false;
  iFrameTimer = new Timer(Timer.secondsToTick(1.5));

  gun: Gun;

  constructor(app: Application) {
    super();
    this.name = "player";
    this.app = app;
    const knightIdleFrames = [
      "playerIdle0",
      "playerIdle1",
      "playerIdle2",
      "playerIdle3",
    ];
    const knightIdleTextures = knightIdleFrames.map((frame) =>
      Assets.get(frame)
    );
    knightIdleTextures.map((texture) => texture.defaultAnchor.set(0.5, 0.5));
    this.idleSprite = new AnimatedSprite(knightIdleTextures);
    this.idleSprite.x += this.idleSprite.width * 0.5;
    this.idleSprite.y += this.idleSprite.height * 0.5;

    const knightRunningFrames = [
      "playerRun0",
      "playerRun1",
      "playerRun2",
      "playerRun3",
    ];
    const knightRunningTextures = knightRunningFrames.map((frame) =>
      Assets.get(frame)
    );
    knightRunningTextures.map((texture) => texture.defaultAnchor.set(0.5, 0.5));
    this.runningSprite = new AnimatedSprite(knightRunningTextures);
    this.runningSprite.x += this.runningSprite.width * 0.5;
    this.runningSprite.y += this.runningSprite.height * 0.5;

    this.bodyBounds = new Rectangle(
      0,
      0,
      this.runningSprite.width,
      this.runningSprite.height
    );
    this.pos = new Vector2(app.screen.width / 2, app.screen.height / 2);
    this.commitPosition();
    this.speed = new Vector2();
    this.acceleration = 5;
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
    PhysicsContext.addBody(this);

    // Input and interactivity
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
    this.idleSprite.animationSpeed = Timer.ANIMATION_SPEED;
    this.idleSprite.play();
    this.runningSprite.animationSpeed = Timer.ANIMATION_SPEED;
    this.runningSprite.play();
    // this.runningSprite.onFrameChange = this.onPlayerFrameChange.bind(this);

    this.hpBackground = new Sprite(Texture.WHITE);
    this.hpBackground.tint = 0x000000;
    this.hpBackground.width = this.idleSprite.width + 5 * 2;
    this.hpBackground.height = this.HP_BAR_HEIGHT;
    this.hpBackground.position.x -= 5;
    this.hpBackground.position.y += this.idleSprite.height + this.HP_BAR_HEIGHT;
    this.addChild(this.hpBackground);

    this.hpFill = new Sprite(Texture.WHITE);
    this.hpFill.tint = 0xff0000;
    this.hpFill.width = this.hpBackground.width;
    this.hpFill.height = this.HP_BAR_HEIGHT;
    this.hpFill.position = this.hpBackground.position;
    this.addChild(this.hpFill);

    // Systems related data initialization
    this.level = 1;
    this.xp = new Stat("xp", 2);
    this.xp.setCurrent(0);

    this.health = new Stat("hp", 10);

    this.gun = new Gun(app);
  }

  update() {
    if (this.recentHit) {
      if (this.iFrameTimer.advance()) {
        this.recentHit = false;
      }
    }

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
      this.commitPosition();
    }

    this.gun.update(this.pos);
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

  /** ALWAYS call this after modifying this.pos */
  commitPosition() {
    this.position.x = this.pos.x;
    this.position.y = this.pos.y;
    this.bodyBounds.origin.x = this.pos.x;
    this.bodyBounds.origin.y = this.pos.y;
  }

  gainXp() {
    this.xp.increase(1);
    if (this.xp.atMax()) {
      this.level += 1;
      this.xp.setCurrent(0);
      SignalDispatcher.fireSignal("playerLevelUp", { level: this.level });
    }
    SignalDispatcher.fireSignal("playerXpGained", { xp: this.xp });
  }

  takeDamage() {
    this.health.decrease(1);
    const maxWidth = this.hpBackground.width;
    this.hpFill.width = this.health.progress() * maxWidth;
    this.recentHit = true;
  }

  kind(): string {
    return this.name;
  }

  getPosition(): Vector2 {
    return this.pos;
  }

  getBoundsRect(): Rectangle {
    return this.bodyBounds;
  }

  onCollisionEnter(other: PhysicsBody) {
    if (other.kind() === "enemy") {
      if (!this.recentHit) {
        this.takeDamage();
      }
    }
  }
}
