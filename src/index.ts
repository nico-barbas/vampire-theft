import { Application, Assets } from "pixi.js";
import { EnemyManager } from "./enemy";
import { Player } from "./player";

const app = new Application({
  view: document.getElementById("game") as HTMLCanvasElement,
  backgroundColor: 0x6495ed,
  width: window.innerWidth,
  height: window.innerHeight,
});

app.renderer.resize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", (_) => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

const player = new Player(app);
app.stage.addChild(player);

Assets.add("skeleton", "frames/skelet_idle_anim_f0.png");
Assets.load("skeleton");

const enemyManager = new EnemyManager(app);
app.stage.addChild(enemyManager);

// Player Movement Manager (keep it at the bottom of code)
addEventListener("keydown", ({ code }) => {
  if (code === "ArrowRight") {
    player.keys.right.pressed = true;
  } else if (code === "ArrowLeft") {
    player.keys.left.pressed = true;
  } else if (code === "ArrowUp") {
    player.keys.up.pressed = true;
  } else if (code === "ArrowDown") {
    player.keys.down.pressed = true;
  }
});

addEventListener("keyup", ({ code }) => {
  if (code === "ArrowRight") {
    player.keys.right.pressed = false;
  } else if (code === "ArrowLeft") {
    player.keys.left.pressed = false;
  } else if (code === "ArrowUp") {
    player.keys.up.pressed = false;
  } else if (code === "ArrowDown") {
    player.keys.down.pressed = false;
  }
});
