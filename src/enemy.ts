import { Application, Container, Sprite, Assets } from "pixi.js";
import { Vector2 } from "./math";
import { Timer } from "./utils";

export class EnemyManager extends Container {
  app: Application;
  timer: Timer;
  static readonly DEFAULT_SPAWN_RATE: number = Timer.secondsToTick(5);
  enemies: Array<Enemy>;
  dummyTarget: EmptyTarget;

  constructor(app: Application) {
    super();
    this.app = app;
    this.timer = new Timer(EnemyManager.DEFAULT_SPAWN_RATE);
    this.enemies = new Array();
    this.dummyTarget = new EmptyTarget(
      new Vector2(this.app.screen.width / 2, this.app.screen.height / 2)
    );

    app.ticker.add(() => {
      if (this.timer.advance()) {
        this.spawn();
      }

      this.enemies.forEach((enemy) => {
        enemy.update();
      });
    });
  }

  spawn() {
    const xDir = Math.random() >= 0.5 ? 1 : 0;
    const yDir = Math.random() >= 0.5 ? 1 : 0;
    const xPos = Math.random() * this.app.screen.width;
    const yPos = Math.random() * this.app.screen.height;
    const randomSpawnPosition = new Vector2(xDir * xPos, yDir * yPos);
    const enemy = new Enemy(randomSpawnPosition);
    enemy.setTarget(this.dummyTarget);
    this.enemies.push(enemy);
    this.addChild(enemy);
  }
}

export interface EnemyTarget {
  getPosition(): Vector2;
}

class EmptyTarget {
  position: Vector2;
  constructor(position: Vector2) {
    this.position = position;
  }

  getPosition(): Vector2 {
    return this.position;
  }
}

export class Enemy extends Container {
  sprite: Sprite | null;
  runSpeed: number = 1;
  target: EnemyTarget | null;
  pos: Vector2;

  constructor(position: Vector2) {
    super();
    // FIXME: Hard coded for now, should change later
    const spriteAsset = Assets.get("skeleton");
    if (spriteAsset) {
      this.sprite = new Sprite(spriteAsset);
      this.addChild(this.sprite);
    } else {
      this.sprite = null;
    }

    this.target = null;
    this.pos = position;
    this.x = this.pos.x;
    this.y = this.pos.y;
  }

  update() {
    if (this.target) {
      const dir = this.target.getPosition().sub(this.pos);
      dir.normalizeInPlace().scaleInPlace(this.runSpeed);

      this.pos.addInPlace(dir);
      this.x = this.pos.x;
      this.y = this.pos.y;
    }
  }

  setTarget(target: EnemyTarget) {
    this.target = target;
  }
}
