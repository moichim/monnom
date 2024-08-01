import { AbstractMovement } from "./AbstractMovement";

export class TweenMovement extends AbstractMovement {

    protected onStart(): void {

      // this.brick.setIgnoreGravity( true );
      // this.brick.setCollidesWith( 99 )

      const tween = this.brick.scene.tweens.add({
        targets: this.brick,
        x: this.targetPosition.x,
        y: this.targetPosition.y,
        angle: this.targetRotation,
        ease: "linear",
        repeat: 0,
        duration: 1000,
        onComplete: () => {
          this.isAtPosition = true;
          this.isAtRotation = true;
        }
      });

      tween.play();
        
    }

    protected onStop(): void {
        
    }

    protected onEnd(): void {
        this.movement.atPlaceInComposition();
    }

    protected onUpdate(): void {

    }

}