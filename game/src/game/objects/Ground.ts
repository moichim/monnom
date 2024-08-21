import { BricksScene } from "../scene/BricksScene";

export class Ground extends Phaser.GameObjects.Rectangle {

    declare scene: BricksScene;

    constructor(
        scene: BricksScene,
        centerX: number,
        areaBottomY: number,
        width: number,
        height: number
    ) {
        super( scene, centerX, areaBottomY - 50, width - 50, 20, 0x000000, 1 );
        //this.displayOriginX = 0;
        // this.displayOriginY = 0;
        this.alpha = 1;
        // this.fillAlpha = 1;
        //this.fillColor = 0xffffff;
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