import Phaser from "phaser";
import { BricksScene } from "../scene/BricksScene";
import { MovementManager } from "./movements/MovementManager";

export enum BrickMovements {
    NATURAL = "Natural",
    // JUMP = "Jump",
    SWAP = "Swap"
}


export class Brick extends Phaser.Physics.Matter.Sprite {

  declare public scene: BricksScene;

  protected _inComposition = false;
  public get inComposition() {
    return this._inComposition;
  }
  public set inComposition(value: boolean) {
    this._inComposition = value;
    this.scene.recalculateCompositionState();
  }


  public readonly movement = new MovementManager( this );

  constructor(
    name: string,
    scene: BricksScene,
    x: number,
    y: number,
    texture: string,
    frame: number | undefined = undefined,
    options: Phaser.Types.Physics.Matter.MatterBodyConfig = {}
  ) {


    const shapes = scene.cache.json.get( "shapes" );

    const shape = shapes[texture] as Phaser.Types.Physics.Matter.MatterBodyConfig;
    shape.density = 1;
    shape.restitution = 1;
    shape.friction = 0.1;
    shape.frictionAir = 0.01;
    shape.frictionStatic = 0.5;

    super(
      scene.matter.world, 
      x, 
      y, 
      texture, 
      frame, 
      { 
        ...options, 
        // chamfer: 16, 
        shape: shape as Phaser.Types.Physics.Matter.MatterSetBodyConfig
      });

    this.name = name;

    this.on(
      Phaser.Input.Events.POINTER_OVER,
      () => {
        this.scene.game.canvas.style.cursor = "pointer";
      }
    );

    this.on(
      Phaser.Input.Events.POINTER_OUT,
      () => {
        this.scene.game.canvas.style.cursor = "default";
        this.scene.area.setOff();
      }
    );

    this.on(
      Phaser.Input.Events.POINTER_DOWN,
      (context: Brick) => {

        this.scene.area.setOn();
        this.movement.startDragging();
        this.scene.compositionChanged = true;
        this.scene.game.canvas.style.cursor = "pointer";

        console.log( this.movement, context );
    
      },
      this
    );

    this.on(
      Phaser.Input.Events.POINTER_UP,
      (context: Brick) => {
        this.movement.endDragging();
        console.log( context );
        this.scene.area.setOff();
      },
      this
    );

    // this.setScale(0.2, 0.2);

  }

  placeOnPosition(
    x: number,
    y: number,
    angle: number
  ): this {
    this.setPosition( x, y );
    this.setAngle( angle );
    return this;
  }

  addedToScene(): void {
    super.addedToScene();

    const rotation = Math.random() * 360;
    this.setRotation(rotation);
    this.setInteractive();
    this.setBounce( 0 );
  }

  fall() {
    this.movement.fall();
    this.inComposition = false;
  }

  public preUpdate(
    // delta: number, 
    // time: number
  ) {
    this.movement.update();
  }

  getStoreData(
    relativeTo: Phaser.Math.Vector2
  ) {

    const positionAbsolute = new Phaser.Math.Vector2(this.x, this.y);

    const positionCenter = positionAbsolute.clone().subtract( relativeTo )

    return {
      position: {
        absolute: positionAbsolute,
        relative: positionCenter
      },
      textureKey: this.texture.key,
      name: this.name,
      angle: this.angle,
      scale: this.scale
    }
  }




}
