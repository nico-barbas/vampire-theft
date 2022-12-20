import { Assets, Container, Rectangle, Sprite } from "pixi.js";
import { Vector2 } from "./math";
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
      const reward = new ExpReward(enemyInfo.position);
      if (reward.sprite) {
        this.rewards.push(reward);
        this.addChild(reward.sprite);
      }
    } else {
      console.log("But no loot was dropped..");
    }
  }
}

type Reward = ExpReward | LootReward;

class ExpReward {
  sprite: Sprite | null;
  bounds: Rectangle;

  constructor(position: Vector2) {
    this.bounds = new Rectangle(position.x, position.y, 0, 0);

    const spriteAsset = Assets.get("coin");
    if (spriteAsset) {
      this.sprite = new Sprite(spriteAsset);
      this.bounds.width = this.sprite.width;
      this.bounds.height = this.sprite.height;
      this.sprite.position.x = position.x;
      this.sprite.position.y = position.y;
    } else {
      console.log(`Failed to retrieve asset "coin"`);
      this.sprite = null;
    }
  }
}

class LootReward {
  // sprite: Sprite | null;
}
