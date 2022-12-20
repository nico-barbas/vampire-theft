import { Application, Container, Texture, TilingSprite } from "pixi.js";

export class Scene extends Container  {
  constructor(app: Application) {
    super();
    const floortexture = Texture.from("frames/floor_1.png");
    const floormap = new TilingSprite(floortexture, app.screen.width, app.screen.height);
    const toptexture = Texture.from("frames/wall_mid.png");
    const topmap = new TilingSprite(toptexture, app.screen.width, (toptexture.height * 24));
    const lefttexture = Texture.from("frames/wall_side_front_right.png");
    const leftmap = new TilingSprite(lefttexture, (lefttexture.width * 24), app.screen.height);
    const righttexture = Texture.from("frames/wall_side_front_left.png");
    const rightmap = new TilingSprite(righttexture, (righttexture.width * 24), app.screen.height);
    app.stage.addChild(floormap);
    app.stage.addChild(topmap);
    app.stage.addChild(leftmap);
    rightmap.anchor._x = -app.screen.width / 24 + 1
    app.stage.addChild(rightmap);
  }
}
