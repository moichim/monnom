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
        super( 
            scene.matter.world, 
            x,
            y, 
            "ground"
        );

        this.setDisplaySize( width, height );
        this.setStatic( true );
        this.alpha = 1;
        this.scene.add.existing( this );

        this.setCollisionCategory( scene.categories.base );
        this.setCollidesWith(Object.values( scene.categories ));

    }

    setOn() {
        // this.alpha = 1;
    }

    setOff( ) {
        // this.alpha = 0.1;
    }

}