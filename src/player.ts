import { Application, Sprite, Container } from "pixi.js";

export class Player extends Container {
  app: Application;
  sprite: Sprite;

  constructor(app: Application) {
    super();
    this.app = app;
    this.sprite = Sprite.from("frames/knight_f_hit_anim_f0.png");
    this.x = app.screen.width / 2;
    this.y = app.screen.height / 2;
    this.sprite.interactive = true;
    this.addChild(this.sprite);
    app.ticker.add(() => this.idleAnimation());
    document.addEventListener("keydown", (event) => this.movement(event));
  }

  idleAnimation() {
    // this.x += 1;
  }

  movement(event: any) {
    console.log(event);
    if (event.key == "ArrowDown") {
      this.y += 1;
    } else if (event.key == "ArrowRight") {
      this.x += 1;
    } else if (event.key == "ArrowLeft") {
      this.x -= 1;
    } else if (event.key == "ArrowUp") {
      this.y -= 1;
    }
  }
}
