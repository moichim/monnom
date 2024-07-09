import { MovementManager } from "./MovementManager";
import Phaser from "phaser";

export abstract class AbstractMovement {

    protected isAtPosition = false;
    protected isAtRotation = false;
    protected isStarted = false;
    public isEnded = false;

    protected brick = this.movement.brick;

    public constructor(
        public readonly movement: MovementManager,
        public readonly targetPosition: Phaser.Math.Vector2,
        public readonly targetRotation: number
    ) {

    }

    protected abstract onStart(): void;
    protected abstract onStop(): void;
    protected abstract onEnd(): void;
    protected abstract onUpdate(): void;


    public start(): void {
        this.isStarted = true;
        this.onStart();
    }

    public end() {
        this.isEnded = true;
        this.onEnd();
    }

    public stop() {
        this.isEnded = false;
        this.onStop();
    }

    public update() {

        if ( this.isAtPosition && this.isAtRotation ) {
            // this.stop();
            this.movement.atPlace();
        } else if ( this.isStarted && !this.isEnded ) {
            this.onUpdate();
        }
    }

}