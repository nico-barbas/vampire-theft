import { Application, Container, Sprite, Assets } from "pixi.js";
import { Rectangle, Vector2 } from "./math";
import { PhysicsBody, PhysicsContext } from "./physics";
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
    this.name = "enemyManager";
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
            SignalDispatcher.fireSignal("enemyDied", {
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

  firstInRadius(p: Vector2, radius: number): Enemy | null {
    for (let i = 0; i < this.enemies.length; i += 1) {
      const enemy = this.enemies[i];
      const dist = p.sub(enemy.pos).lengthSquared();
      if (Math.abs(dist) >= radius) {
        return enemy;
      }
    }

    return null;
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
  bodyRect: Rectangle;

  debugDeathTimer = new Timer(Timer.secondsToTick(5));

  constructor(position: Vector2) {
    super();
    // FIXME: Hard coded for now, should change later
    const spriteAsset = Assets.get("skeleton");
    // This line puts the origin point of the Sprite to the center of both axes
    spriteAsset.defaultAnchor.set(0.5, 0.5);
    this.sprite = new Sprite(spriteAsset);
    this.addChild(this.sprite);
    this.target = null;
    this.direction = new Vector2(
      Math.random(),
      Math.random()
    ).normalizeInPlace();
    this.pos = position;
    this.x = this.pos.x;
    this.y = this.pos.y;
    this.bodyRect = new Rectangle(
      this.pos.x,
      this.pos.y,
      this.sprite.width,
      this.sprite.height
    );

    PhysicsContext.addBody(this);
  }

  update(): EnemyStatus {
    if (this.debugDeathTimer.advance()) {
      PhysicsContext.removeBody(this);
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
        this.commitPosition();
      }

      return "ALIVE";
    }
  }

  commitPosition() {
    this.position.x = this.pos.x;
    this.position.y = this.pos.y;
    this.bodyRect.origin.x = this.pos.x;
    this.bodyRect.origin.y = this.pos.y;
  }

  setTarget(target: EnemyTarget) {
    this.target = target;
  }

  kind(): string {
    return "enemy";
  }

  getBoundsRect(): Rectangle {
    return this.bodyRect;
  }

  onCollisionEnter(_: PhysicsBody) {}
}
