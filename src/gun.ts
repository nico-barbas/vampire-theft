import { Application, Container, Sprite, Texture } from "pixi.js";
import { EnemyManager } from "./enemy";
import { Timer } from "./utils";
import { Vector2 } from "./math";

export class Gun extends Container {
  app: Application;
  enemies: EnemyManager;
  fireTimer: Timer;
  bullets = new Array<Bullet>();
  halfScreenWidth: number;

  constructor(app: Application) {
    super();
    this.app = app;
    this.enemies = app.stage.getChildByName("enemyManager");
    this.fireTimer = new Timer(Timer.secondsToTick(1));
    this.halfScreenWidth = app.renderer.width / 2;
    this.app.stage.addChild(this);
  }

  update(pos: Vector2) {
    if (!this.enemies) {
      this.enemies = this.app.stage.getChildByName("enemyManager");
      return;
    }

    if (this.fireTimer.advance()) {
      const enemy = this.enemies.firstInRadius(pos, 200);

      if (enemy) {
        const dir = enemy.pos.sub(pos);
        const bullet = new Bullet(pos.x, pos.y, dir, 10);
        bullet.setTravelDistance(this.halfScreenWidth);
        this.bullets.push(bullet);
        this.addChild(bullet.sprite);
        console.log("Fired!");
      }
    }

    const removed = [];
    for (let i = 0; i < this.bullets.length; i += 1) {
      const done = this.bullets[i].update();
      if (done) {
        removed.push(i);
      }
    }

    removed
      .sort((a, b) => {
        return b - a;
      })
      .forEach((index) => {
        this.removeChild(this.bullets[index].sprite);
        this.bullets.splice(index, 1);
      });
  }
}

class Bullet {
  sprite: Sprite;
  start: Vector2;
  pos: Vector2;
  direction: Vector2;
  velocity: number;
  distance: number = 0;

  constructor(x: number, y: number, dir: Vector2, vel: number) {
    this.sprite = new Sprite(Texture.WHITE);
    this.sprite.width = 8;
    this.sprite.height = 8;
    this.sprite.tint = 0xffffff;
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    this.start = new Vector2(x, y);
    this.pos = new Vector2(x, y);
    this.direction = dir.normalizeInPlace();
    this.velocity = vel;
  }

  setTravelDistance(distance: number) {
    this.distance = distance * distance;
  }

  update(): boolean {
    this.direction.normalizeInPlace().scaleInPlace(this.velocity);
    this.pos.addInPlace(this.direction);
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;

    const v = this.pos.sub(this.start);
    return v.lengthSquared() >= this.distance;
  }
}
