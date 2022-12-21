import { Application, Container, Sprite, Assets } from "pixi.js";
import { Vector2 } from "./math";
import { Player } from "./player";
import { SignalDispatcher } from "./signals";
import { Timer } from "./utils";

export class EnemyManager extends Container {
  app: Application;
  timer: Timer;
  static readonly DEFAULT_SPAWN_RATE: number = Timer.secondsToTick(5);
  player: Player;
  enemies: Array<Enemy>;

  constructor(app: Application) {
    super();
    this.app = app;
    this.timer = new Timer(EnemyManager.DEFAULT_SPAWN_RATE);
    this.player = this.app.stage.getChildByName("player", true);
    this.enemies = new Array();

    app.ticker.add(() => {
      if (this.timer.advance()) {
        this.spawn();
      }

      const removed = new Array<number>();
      for (let i = 0; i < this.enemies.length; i += 1) {
        const status = this.enemies[i].update();

        switch (status) {
          case "ALIVE":
            break;
          case "DEAD":
            removed.push(i);
            break;
        }
      }

      if (removed.length > 0) {
        removed
          .sort((a, b): number => {
            return b - a;
          })
          .forEach((index) => {
            const e = this.enemies.splice(index, 1)[0];
            this.removeChild(e);
            SignalDispatcher.firesignal("enemyDied", {
              name: "skeleton",
              position: e.pos,
            });
          });
      }
    });
  }

  spawn() {
    const xDir = Math.random() >= 0.5 ? 1 : 0;
    const yDir = Math.random() >= 0.5 ? 1 : 0;
    const xPos = Math.random() * this.app.screen.width;
    const yPos = Math.random() * this.app.screen.height;
    const randomSpawnPosition = new Vector2(xDir * xPos, yDir * yPos);
    const enemy = new Enemy(randomSpawnPosition);
    enemy.setTarget(this.player);
    this.enemies.push(enemy);
    this.addChild(enemy);
  }
}

export interface EnemyTarget {
  getPosition(): Vector2;
}

// class EmptyTarget {
//   position: Vector2;
//   constructor(position: Vector2) {
//     this.position = position;
//   }

//   getPosition(): Vector2 {
//     return this.position;
//   }
// }

const ENEMY_STATUS = {
  ALIVE: "Alive",
  DEAD: "Dead",
};

type EnemyStatus = keyof typeof ENEMY_STATUS;

export class Enemy extends Container {
  sprite: Sprite | null;
  runSpeed: number = 1;
  steeringSpeed: number = 1;
  target: EnemyTarget | null;
  pos: Vector2;
  direction: Vector2;

  debugDeathTimer = new Timer(Timer.secondsToTick(5));

  constructor(position: Vector2) {
    super();
    // FIXME: Hard coded for now, should change later
    const spriteAsset = Assets.get("skeleton");
    if (spriteAsset) {
      spriteAsset.defaultAnchor.set(0.5, 0.5);
      this.sprite = new Sprite(spriteAsset);
      this.addChild(this.sprite);
    } else {
      this.sprite = null;
    }

    this.target = null;
    this.direction = new Vector2(
      Math.random(),
      Math.random()
    ).normalizeInPlace();
    this.pos = position;
    this.x = this.pos.x;
    this.y = this.pos.y;
  }

  update(): EnemyStatus {
    if (this.debugDeathTimer.advance()) {
      return "DEAD";
    } else {
      const dt = 1 / 60;
      if (this.target) {
        const targetDirection = this.target
          .getPosition()
          .sub(this.pos)
          .normalizeInPlace();
        const steer = targetDirection.sub(this.direction);
        const steerLength = steer.length();

        const steerScalar = Math.max(steerLength, dt * this.steeringSpeed);
        steer.normalizeInPlace().scaleInPlace(steerScalar);

        this.direction
          .addInPlace(steer)
          .normalizeInPlace()
          .scaleInPlace(this.runSpeed);
        this.pos.addInPlace(this.direction);
        this.x = this.pos.x;
        this.y = this.pos.y;
      }

      return "ALIVE";
    }
  }

  setTarget(target: EnemyTarget) {
    this.target = target;
  }
}
