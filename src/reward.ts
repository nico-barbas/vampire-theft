import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Sprite,
} from "pixi.js";
import { Vector2, Rectangle } from "./math";
import { PhysicsBody, PhysicsContext } from "./physics";
import { Player } from "./player";
import { SignalDispatcher } from "./signals";
import { Timer } from "./utils";

export class RewardManager extends Container {
  player: Player;
  rewards: Array<Reward>;

  constructor(app: Application) {
    super();
    this.player = app.stage.getChildByName("player");
    this.rewards = new Array();

    SignalDispatcher.addListener("enemyDied", this.dropReward.bind(this));
  }

  dropReward(enemyInfo: any) {
    // FIXME: Debug value. Not sure how we want to handle the drop rate/chance
    if (Math.random() >= 0.5) {
      const reward = new ExpReward(
        enemyInfo.position,
        this.onRewardPickedUp.bind(this)
      );
      if (reward.sprite) {
        this.rewards.push(reward);
        this.addChild(reward.sprite);
      }
    }
  }

  onRewardPickedUp(reward: Reward) {
    for (let i = 0; i < this.rewards.length; i += 1) {
      if (this.rewards[i] === reward) {
        this.rewards.splice(i, 1);
        break;
      }
    }
    if (reward.sprite) {
      this.removeChild(reward.sprite);
    }

    this.player.gainXp();
  }
}

type Reward = ExpReward | LootReward;

class ExpReward {
  private readonly boundsPaddingScale = 1.5;
  sprite: AnimatedSprite | null;
  bounds: Rectangle;
  pickUpCallback: (r: Reward) => void;

  constructor(position: Vector2, pickUpCallback: (r: Reward) => void) {
    this.pickUpCallback = pickUpCallback;
    this.bounds = new Rectangle(position.x, position.y, 0, 0);

    const coinFrames = ["coin0", "coin1", "coin2", "coin3"];
    const coinAssets = coinFrames.map((frame) => Assets.get(frame));
    this.sprite = new AnimatedSprite(coinAssets);
    this.bounds.width = this.sprite.width * this.boundsPaddingScale;
    this.bounds.height = this.sprite.height * this.boundsPaddingScale;
    this.sprite.position.x = position.x;
    this.sprite.position.y = position.y;
    this.sprite.animationSpeed = Timer.ANIMATION_SPEED / 2;
    this.sprite.play();

    PhysicsContext.addBody(this);
  }

  kind(): string {
    return "xp";
  }

  getBoundsRect(): Rectangle {
    return this.bounds;
  }

  onCollisionEnter(other: PhysicsBody) {
    if (other.kind() === "player") {
      console.log("Loot picked up!");
      PhysicsContext.removeBody(this);
      this.pickUpCallback(this);
    }
  }
}

class LootReward {
  sprite: Sprite | null;

  constructor() {
    this.sprite = null;
  }
}
