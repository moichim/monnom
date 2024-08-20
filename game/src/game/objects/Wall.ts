import { BricksScene } from "../scene/BricksScene";

export class Wall extends Phaser.Physics.Matter.Sprite {

    declare scene: BricksScene;

    constructor(
        scene: BricksScene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super( scene.matter.world, x, y, "ground" );

        this.setCollisionCategory( this.scene.bufferCategory );

        this.setCollidesWith( [
            this.scene.groundCategory,
            this.scene.bufferCategory,
            this.scene.compositionCategory
        ] );

        this.setDisplaySize( width, height );
        this.setStatic( true );
        this.setActive( true );
        this.setAlpha( .5 );
        this.scene.add.existing( this );

    }

    setOn() {
        // this.alpha = 1;
    }

    setOff( ) {
        // this.alpha = 0.1;
    }

}