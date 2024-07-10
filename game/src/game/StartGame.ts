import { AUTO, Game } from "phaser";
import { BricksScene as MainGame } from "./scene/BricksScene";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const baseConfig: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 900,
  parent: "game-container",
  backgroundColor: "#fff",
  physics: {
    default: "matter",
    matter: {
      // debug: true,
    },
  },
  audio: {
    noAudio: true
  },
  scene: [MainGame],
};

const StartGame = (parent: string) => {

  const windowArea = window.innerWidth * window.innerHeight;

  const targetFreeArea = windowArea * 4 / 5;
  const bricksArea = 1454690 / 3;
  const totalArea = targetFreeArea + bricksArea;

  const width = window.innerWidth;
  const height = totalArea / width;

  const config = {
    ...baseConfig,
    width: width,
    height: height

  };


  return new Game({ ...config, parent });
};

export default StartGame;