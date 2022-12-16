import { Application, Sprite } from "pixi.js";

const app = new Application({
  view: document.getElementById("game") as HTMLCanvasElement,
  backgroundColor: 0x6495ed,
  width: window.innerWidth,
  height: window.innerHeight,
});

// app.renderer.view.style.position = "absolute";
// app.renderer.view.style.display = "block";

app.renderer.resize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", (_) => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

const clampy: Sprite = Sprite.from("clampy.png");

clampy.anchor.set(0.5);

clampy.x = app.screen.width / 2;
clampy.y = app.screen.height / 2;

app.stage.addChild(clampy);
