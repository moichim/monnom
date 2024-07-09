import { AbstractMovement } from "./AbstractMovement";

export class NaturalMovement extends AbstractMovement {

    protected onStart(): void {
        
    }

    protected onStop(): void {
        
    }

    protected onEnd(): void {
        
    }

    protected onUpdate(): void {


        if (this.targetPosition !== undefined || this.targetRotation !== undefined) {

            // Update movement towards target location
            if (this.targetPosition) {
              const currentPosition = this.brick.getCenter();
      
              const direction = this.targetPosition
                .clone()
                .subtract(currentPosition)
                .normalize();
      
              const distance = this.targetPosition.distance(currentPosition);
      
              const diagonal =
                (this.brick.scene.game.canvas.width + this.brick.scene.game.canvas.height) / 2;
      
              const speed = (distance / diagonal) * 100;
      
              if (distance > 3) {
                this.brick.setVelocity(direction.x * speed, direction.y * speed);
              } else {
                this.isAtPosition = true;
              }
            }
      
            if (this.targetRotation !== undefined) {
              const angleDelta = this.targetRotation - this.brick.angle;
      
              if (Math.abs(angleDelta) > 0.1) {
                const aspect = angleDelta > 1 ? 0.05 : angleDelta > 0.5 ? 0.02 : 0.01;
      
                this.brick.setAngularVelocity(angleDelta * aspect);
              } else {
                this.isAtRotation = true;
              }
            }
      
          }

    }

}