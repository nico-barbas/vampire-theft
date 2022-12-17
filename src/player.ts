import { Application, Sprite, Container } from "pixi.js";

export class Player extends Container {
  app: Application;
  sprite: Sprite;
  speed: any;
  keys: any;
  acceleration: number;

  constructor(app: Application) {
    super();
    this.app = app;
    this.sprite = Sprite.from("frames/knight_f_hit_anim_f0.png");
    this.position.x = app.screen.width / 2;
    this.position.y = app.screen.height / 2;
    this.speed = {
      x: 0,
      y: 0,
    };
    this.acceleration = 5;
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
    this.sprite.interactive = true;
    this.addChild(this.sprite);
    app.ticker.add(() => {
      this.update();
    });
  }

  update() {
    // this.update();
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
}
