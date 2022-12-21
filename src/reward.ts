import { Assets, Container, Sprite } from "pixi.js";
import { Vector2, Rectangle } from "./math";
import { PhysicsBody, PhysicsContext } from "./physics";
import { SignalDispatcher } from "./signals";

export class RewardManager extends Container {
  rewards: Array<Reward>;

  constructor() {
    super();
    this.rewards = new Array();

    SignalDispatcher.addListener("enemyDied", this.dropReward.bind(this));
  }

  dropReward(enemyInfo: any) {
    console.log(`Enemy ${enemyInfo.name} died`);
    // FIXME: Debug value. Not sure how we want to handle the drop rate/chance
    if (Math.random() >= 0.5) {
      console.log("And dropped something!!");
      const reward = new ExpReward(
        enemyInfo.position,
        this.onRewardPickedUp.bind(this)
      );
      if (reward.sprite) {
        this.rewards.push(reward);
        this.addChild(reward.sprite);
      }
    } else {
      console.log("But no loot was dropped..");
    }
  }

  onRewardPickedUp(_: Reward) {
    console.log("Should delete reward");
  }
}

type Reward = ExpReward | LootReward;

class ExpReward {
  private readonly boundsPaddingScale = 1.5;
  sprite: Sprite | null;
  bounds: Rectangle;
  pickUpCallback: (r: Reward) => void;

  constructor(position: Vector2, pickUpCallback: (r: Reward) => void) {
    this.pickUpCallback = pickUpCallback;
    this.bounds = new Rectangle(position.x, position.y, 0, 0);

    const spriteAsset = Assets.get("coin");
    if (spriteAsset) {
      this.sprite = new Sprite(spriteAsset);
      this.bounds.width = this.sprite.width * this.boundsPaddingScale;
      this.bounds.height = this.sprite.height * this.boundsPaddingScale;
      this.sprite.position.x = position.x;
      this.sprite.position.y = position.y;

      PhysicsContext.addBody(this);
    } else {
      console.log(`Failed to retrieve asset "coin"`);
      this.sprite = null;
    }
  }

  kind(): string {
    return "xp";
  }

  getBoundsRect(): Rectangle {
    return this.bounds;
  }

  onCollisionEnter(_: PhysicsBody) {
    console.log("Loot picked up!");
  }
}

class LootReward {
  // sprite: Sprite | null;
}
