import { Application, Container, Sprite, Texture } from "pixi.js";
import { EnemyManager, Enemy } from "./enemy";
import { Timer } from "./utils";
import { Rectangle, Vector2 } from "./math";
import { PhysicsBody, PhysicsContext } from "./physics";

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
        bullet.setCollisionCount(1);
        PhysicsContext.addBody(bullet);
        this.bullets.push(bullet);
        this.addChild(bullet.sprite);
        console.log("Fired!");
      }
    }

    const removed = [];
    for (let i = 0; i < this.bullets.length; i += 1) {
      const bullet = this.bullets[i];
      bullet.update();
      if (bullet.done()) {
        removed.push(i);
      }
    }

    removed
      .sort((a, b) => {
        return b - a;
      })
      .forEach((index) => {
        PhysicsContext.removeBody(this.bullets[index]);
        this.removeChild(this.bullets[index].sprite);
        this.bullets.splice(index, 1);
      });
  }
}

class Bullet {
  sprite: Sprite;
  start: Vector2;
  pos: Vector2;
  bounds: Rectangle;
  direction: Vector2;
  velocity: number;
  distance: number = 0;
  currentDistance: number = 0;
  maxCollisionCount: number = 0;
  collisionCount: number = 0;

  constructor(x: number, y: number, dir: Vector2, vel: number) {
    this.sprite = new Sprite(Texture.WHITE);
    this.sprite.width = 8;
    this.sprite.height = 8;
    this.sprite.tint = 0xffffff;
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    this.start = new Vector2(x, y);
    this.pos = new Vector2(x, y);
    this.bounds = new Rectangle(0, 0, 8, 8);
    this.bounds.origin = this.pos;
    this.direction = dir.normalizeInPlace();
    this.velocity = vel;
  }

  setTravelDistance(distance: number) {
    this.distance = distance * distance;
  }

  setCollisionCount(n: number) {
    this.maxCollisionCount = n;
  }

  update() {
    this.direction.normalizeInPlace().scaleInPlace(this.velocity);
    this.pos.addInPlace(this.direction);
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;

    const v = this.pos.sub(this.start);
    this.currentDistance = v.lengthSquared();
  }

  done(): boolean {
    return (
      this.currentDistance >= this.distance ||
      this.collisionCount >= this.maxCollisionCount
    );
  }

  kind(): string {
    return "bullet";
  }

  getBoundsRect(): Rectangle {
    return this.bounds;
  }

  onCollisionEnter(other: PhysicsBody) {
    switch (other.kind()) {
      case "enemy":
        const enemy = other as Enemy;
        enemy.takeDamage(1);
        this.collisionCount += 1;
        break;
    }
  }
}
