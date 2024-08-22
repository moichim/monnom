import { AUTO, Game } from "phaser";
import { BricksScene } from "./scene/BricksScene";



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
      debug: import.meta.env.DEV ? {
        showAxes: false,
                showAngleIndicator: true,
                angleColor: 0xe81153,

                showBroadphase: false,
                broadphaseColor: 0xffb400,

                showBounds: false,
                boundsColor: 0xffffff,

                showVelocity: true,
                velocityColor: 0x00aeef,

                showCollisions: true,
                collisionColor: 0xf5950c,
    
                // showSeparations: false,
                separationColor: 0xffa500,

                showBody: true,
                showStaticBody: true,
                showInternalEdges: true,

                renderFill: false,
                renderLine: true,
    
                fillColor: 0x106909,
                fillOpacity: 1,
                lineColor: 0x28de19,
                lineOpacity: 1,
                lineThickness: 1,
    
                staticFillColor: 0x0d177b,
                staticLineColor: 0x1327e4,

                showSleeping: true,
                staticBodySleepOpacity: 1,
                sleepFillColor: 0x464646,
                sleepLineColor: 0x999a99,
    
                showSensors: true,
                sensorFillColor: 0x0d177b,
                sensorLineColor: 0x1327e4,
    
                showPositions: true,
                positionSize: 4,
                positionColor: 0xe042da,
    
                showJoint: true,
                jointColor: 0xe0e042,
                jointLineOpacity: 1,
                jointLineThickness: 2,
    
                pinSize: 4,
                pinColor: 0x42e0e0,
    
                springColor: 0xe042e0,
    
                anchorColor: 0xefefef,
                anchorSize: 4,
    
                showConvexHulls: true,
                hullColor: 0xd703d0
      } : false,
    },
  },
  audio: {
    noAudio: true
  },
  scene: [BricksScene],
};

const StartGame = (parent: string) => {

  let w = window.innerWidth;
  let h = window.innerHeight;

  const isSmall = window.innerWidth < 700;
  if ( isSmall ) {
    w = w * 1.3;
    h = h * 1.3;
  }

  const windowArea = w * h;

  const targetFreeArea = windowArea * 4 / 5;
  const bricksArea = 1454690 / 3;
  const totalArea = targetFreeArea + bricksArea;

  const width = w;
  const height = totalArea / width;

  const config = {
    ...baseConfig,
    width: width,
    height: height
  };


  const game = new Game({ ...config, parent });

  (window as any).Game = game;
  (window as any).isSmall = isSmall;

  return game;
};

export default StartGame;
