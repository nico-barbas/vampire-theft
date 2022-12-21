import { Application, Assets } from "pixi.js";
import { EnemyManager } from "./enemy";
import { PhysicsContext } from "./physics";
import { Player } from "./player";
import { RewardManager } from "./reward";
import { Scene } from "./scene";

const loadAssets = async () => {
  Assets.addBundle("player", {
    playerIdle0: "frames/knight_m_idle_anim_f0.png",
    playerIdle1: "frames/knight_m_idle_anim_f1.png",
    playerIdle2: "frames/knight_m_idle_anim_f2.png",
    playerIdle3: "frames/knight_m_idle_anim_f3.png",
    playerRun0: "frames/knight_m_run_anim_f0.png",
    playerRun1: "frames/knight_m_run_anim_f1.png",
    playerRun2: "frames/knight_m_run_anim_f2.png",
    playerRun3: "frames/knight_m_run_anim_f3.png",
  });
  Assets.add("skeleton", "frames/skelet_idle_anim_f0.png");
  Assets.addBundle("coin", {
    coin0: "frames/coin_anim_f0.png",
    coin1: "frames/coin_anim_f1.png",
    coin2: "frames/coin_anim_f2.png",
    coin3: "frames/coin_anim_f3.png",
  });

  await Assets.loadBundle("player");
  await Assets.load("skeleton");
  await Assets.loadBundle("coin");
};

const main = async () => {
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

  PhysicsContext.init(app);
  await loadAssets();

  const scene = new Scene(app);
  app.stage.addChild(scene);

  const player = new Player(app);
  app.stage.addChild(player);

  const enemyManager = new EnemyManager(app);
  app.stage.addChild(enemyManager);

  app.stage.addChild(new RewardManager());
};

main();
