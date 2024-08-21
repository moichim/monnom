import { BricksScene } from "../scene/BricksScene";
import { Wall } from "./Wall";

export class Ground extends Wall {

    declare scene: BricksScene;

    constructor(
        scene: BricksScene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super( 
            scene, 
            x, 
            y, 
            width, 
            height
        );

        this.setCollisionCategory( this.scene.categories.ground );
        this.setCollidesWith( this.scene.categories.composition );

    }

    setOn() {
        // this.alpha = 1;
    }

    setOff( ) {
        // this.alpha = 0.1;
    }

}