import { BricksScene } from "../scene/BricksScene";

export class Area extends Phaser.GameObjects.Rectangle {

    declare scene: BricksScene;

    constructor(
        scene: BricksScene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super( scene, x, y, width, height, 0xcccccc, 1 );
        this.displayOriginX = 0;
        this.displayOriginY = 0;
        this.alpha = .1;
        this.fillAlpha = 0;
        this.strokeColor = 0x000000;
        this.strokeAlpha = 1;
        this.isStroked = true;

    }

    setOn() {
        this.alpha = 1;
    }

    setOff( ) {
        this.alpha = 0.1;
    }

}