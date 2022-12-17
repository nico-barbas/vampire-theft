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
    app.ticker.add((delta) => this.gameLoop(delta));
  }

  gameLoop(delta: number) {
    this.movement(delta);

    // Keyboard.update();
  }

  movement(delta: number) {
    const speed: number = delta * 5;

    // if (event.key == "ArrowDown") {
    //   this.y += speed;
    // } else if (event.key == "ArrowRight") {
    //   this.x += speed;
    // } else if (event.key == "ArrowLeft") {
    //   this.x -= speed;
    // } else if (event.key == "ArrowUp") {
    //   this.y -= speed;
    // }
  }
}
