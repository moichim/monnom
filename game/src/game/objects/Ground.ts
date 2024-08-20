import Phaser from "phaser";
import { BricksScene } from "../scene/BricksScene";
import { MovementManager } from "./movements/MovementManager";

export enum BrickMovements {
  NATURAL = "Natural",
  // JUMP = "Jump",
  SWAP = "Swap"
}


export class Ground extends Phaser.Physics.Matter.Sprite {

  declare public scene: BricksScene;

  constructor(
    scene: BricksScene,
    centerX: number,
    centerY: number,
    width: number,
    height: number
) {

    super(
        scene.matter.world,
        centerX,
        centerY + ( height / 6 * 2 ),
        "ground",
        0,
        {
            
        }
    );

    this.displayWidth = width - 50;
    this.displayHeight = 15;
    this.setIgnoreGravity( true );
    this.setStatic( true );

    this.setCollisionCategory( scene.groundCategory );

    this.setCollidesWith( [
        scene.compositionCategory
    ] );

    /*
    super( 
        scene, 
        centerX, 
        centerY + ( ( ( height / 2 ) / 3 ) * 2), 
        width - 50, 
        20, 
        0x000000, 
        1
    );
    */
    // this.displayOriginX = 0;
    // this.displayOriginY = 0;
    // this.alpha = 1;
    // this.fillAlpha = 1;
    // this.fillColor = 0xffffff;
    // this.strokeColor = 0x000000;
    // this.strokeAlpha = 1;
    // this.isStroked = true;

}

setOn() {
    // this.alpha = 1;
}

setOff( ) {
    // this.alpha = 0.1;
}

}