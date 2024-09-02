import Phaser from "phaser";
import { BricksScene } from "../scene/BricksScene";
import { MovementManager } from "./movements/MovementManager";
import { PhysicsParams } from "../../utils/physics";

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
    this.scene.checkIfThereAreBickInComposition();
  }

  protected _isDragging = false;
  public get isDragging() {
    return this._isDragging;
  }
  protected set isDragging(value: boolean) {
    this._isDragging = value;
  }

  protected spring?: MatterJS.ConstraintType;


  protected fx?: Phaser.FX.Bloom;

  public readonly movement = new MovementManager(this);

  constructor(
    name: string,
    scene: BricksScene,
    x: number,
    y: number,
    texture: string,
    frame: number | undefined = undefined,
    options: Phaser.Types.Physics.Matter.MatterBodyConfig = {}
  ) {


    const shapes = scene.cache.json.get("shapes");

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
        chamfer: 16,
        shape: shape as Phaser.Types.Physics.Matter.MatterSetBodyConfig
      });

    this.name = name;
    this.setCollisionCategory(this.scene.categories.base);
    this.setCollisionGroup(this.scene.categories.base);
    this.setCollidesWith([
      this.scene.categories.base,
      this.scene.categories.composition
    ]);

    this.setBounce( PhysicsParams.brick.bounce );
    this.setFrictionAir( PhysicsParams.brick.frictionAirOff );
    this.setFrictionStatic( PhysicsParams.brick.frictionStatic );
    this.setFriction( PhysicsParams.brick.friction );

    this.setMass(PhysicsParams.brick.mass);
    this.setDensity(PhysicsParams.brick.density);

    // this.setFriction( 10 );

    this.on(
      Phaser.Input.Events.POINTER_MOVE,
      (event: MouseEvent) => {

        const body = this.body as Phaser.Types.Physics.Matter.MatterBody;
        const contains = this.scene.matter.containsPoint(body, event.x, event.y);
        if (contains) {
          this.scene.game.canvas.style.cursor = "pointer";
        }
        else {
          this.scene.game.canvas.style.cursor = "default";

        }
      }
    );

    this.on(
      Phaser.Input.Events.POINTER_OUT,
      () => {
        this.scene.game.canvas.style.cursor = "default";
      }
    );

    this.on(
      Phaser.Input.Events.POINTER_DOWN,
      (context: Brick) => {
        context;
        if (this.active) {
          this.isDragging = true;
          this.scene.area.setOn();
          this.movement.startDragging();
          this.scene.startDragging();
          this.scene.markAsCompositionChanged();
          this.scene.game.canvas.style.cursor = "pointer";

          /*
          
          this.spring = this.scene.matter.add.mouseSpring({
            bodyA: this.body as BodyType,
            bodyB: this.scene.cursor.body as BodyType,
            length: 1,
      stiffness: 0.1,
          });

          */




          // this.scene.matter.body.setCentre( this.body, new Phaser.Math.Vector2( this.input?.localX,this.input?.localY ), true );

          // this.setOrigin(0,0);

          // console.log( this.centerOfMass, this.input?.localX, this.input?.localY, this.displayWidth, this.displayHeight );
          // this.centerOfMass();
        }
      },
      this
    );



    this.on(
      Phaser.Input.Events.POINTER_UP,
      (context: Brick) => {
        context;
        this.isDragging = false;
        this.movement.endDragging();
        this.scene.area.setOff();
        this.scene.endDragging();

        // this.scene.matter.world.removeConstraint( this.spring! );
      },
      this
    );

  }

  placeOnPosition(
    x: number,
    y: number,
    angle: number
  ): this {
    this.setPosition(x, y);
    this.setAngle(angle);
    return this;
  }

  addedToScene(): void {
    super.addedToScene();

    const rotation = Math.random() * 360;
    this.setRotation(rotation);
    this.setInteractive();
    this.setBounce(0);
  }

  fall() {
    this.movement.fall();
  }

  public preUpdate() {
    this.movement.update();
  }

  getStoreData(
    relativeTo: Phaser.Math.Vector2
  ) {

    const positionAbsolute = new Phaser.Math.Vector2(this.x, this.y);

    const positionCenter = positionAbsolute.clone().subtract(relativeTo)

    return {
      position: {
        absolute: positionAbsolute,
        relative: positionCenter
      },
      textureKey: this.texture.key,
      name: this.name,
      angle: this.angle,
      scale: this.scale,
      width: this.width,
      height: this.height,
      originX: this.originX,
      originY: this.originY
    }
  }

}