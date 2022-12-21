import { SignalDispatcher } from "./signals";

export const initUI = () => {
  SignalDispatcher.addListener("playerXpGained", updateXpBar);
  SignalDispatcher.addListener("playerLevelUp", updateLevel);
};

const updateXpBar = (args: any) => {
  const t = args.xp.current / args.xp.max;
  const xpFill = document.querySelector(".xp-fill") as HTMLDivElement;
  xpFill.style.width = `${t * 100}%`;
};

const updateLevel = (args: any) => {
  const level = document.querySelector(".level") as HTMLDivElement;
  level.innerText = `Level ${args.level}`;
};
