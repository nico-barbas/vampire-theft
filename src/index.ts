import { Application } from "pixi.js";
import { Player } from "./player";

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

const player = new Player(app);

app.stage.addChild(player);
