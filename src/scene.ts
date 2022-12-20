import { Application, Container, Texture, TilingSprite } from "pixi.js";

export class Scene extends Container  {
  constructor(app: Application) {
    super();
    const floortexture = Texture.from("frames/floor_1.png")
    const tilemap = new TilingSprite(floortexture, app.screen.width, app.screen.height)
    app.stage.addChild(tilemap);
  }
}
