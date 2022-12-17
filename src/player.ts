import { Application, Sprite, Container } from "pixi.js";
import { Keyboard } from "./keyboard";

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

    if (Keyboard.isKeyDown("ArrowLeft", "KeyA")) this.x -= speed;
    if (Keyboard.isKeyDown("ArrowRight", "KeyD")) this.x += speed;

    if (Keyboard.isKeyDown("ArrowUp", "KeyW")) this.y -= speed;
    if (Keyboard.isKeyDown("ArrowDown", "KeyS")) this.y += speed;
  }
}
