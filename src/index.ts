import { Application, Assets } from "pixi.js";
import { EnemyManager } from "./enemy";
import { Player } from "./player";
import { RewardManager } from "./reward";

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
Assets.add("coin", "frames/coin_anim_f0.png");
Assets.load("coin");

const enemyManager = new EnemyManager(app);
app.stage.addChild(enemyManager);

app.stage.addChild(new RewardManager());
