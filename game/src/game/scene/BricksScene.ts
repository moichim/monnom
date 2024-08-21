import Phaser, { Scene } from "phaser";
import { AssetManager } from "../../assets/assetManager";
import { EventBus, GameEvents } from "../EventBus";
import { BrickManager } from "./BrickManager";
import { CompositionManager } from "./CompositionManager";
import { assetUrl } from "../../utils/assetUrl";
import { setLoading } from "../../utils/loader";
import { Area } from "../objects/Area";
import { Ground } from "../objects/Ground";

export enum CompositionState {
  NONE,
  HAS,
  CHANGED
}

export class BricksScene extends Scene {

  protected _isZoomIn: boolean = false;
  public get isZoomIn() {
    return this._isZoomIn;
  }

  protected canvas!: HTMLCanvasElement;
  protected container!: HTMLElement;

  camera!: Phaser.Cameras.Scene2D.Camera;
  blockTexture!: Phaser.GameObjects.Image;
  gameText!: Phaser.GameObjects.Text;

  bricks = new BrickManager(this);
  compositions = new CompositionManager(this);

  area!: Area;
  ground!: Ground;

  areaLeft!: number;
  areaRight!: number;
  areaTop!: number;
  areaBottom!: number;

  protected state: CompositionState = CompositionState.NONE;
  public markAsHasComposition() {
    if (this.state === CompositionState.NONE) {
      this.state = CompositionState.HAS;
      EventBus.emit(GameEvents.COMP_STATE, this.state);
    }
  }

  public markAsCompositionChanged() {
    if (this.state !== CompositionState.CHANGED) {
      this.state = CompositionState.CHANGED;
      EventBus.emit(GameEvents.COMP_STATE, this.state);
    }
  }

  public markAsCompNone() {
    this.state = CompositionState.NONE;
    EventBus.emit(GameEvents.COMP_STATE, this.state);
  }

  checkIfThereAreBickInComposition() {
    const anyBrickinComposition = this.bricks.all.find(brick => brick.inComposition);
    if (anyBrickinComposition) {
      this.markAsHasComposition();
    } else {
      this.markAsCompNone();
    }
  }

  public bg!: Phaser.GameObjects.Rectangle;
  protected bgTween!: Phaser.Tweens.Tween;

  public startDragging() {
    this.bg.fillColor = 0xeeeeee;
    if (this.bgTween) this.bgTween.stop();
    this.bgTween = this.tweens.add({
      targets: this.bg,
      ease: "linear",
      alpha: 1,
      repeat: 0,
      duration: 500
    });
  }

  public endDragging() {
    if (this.bgTween) this.bgTween.stop();
    this.bgTween = this.tweens.add({
      targets: this.bg,
      ease: "linear",
      alpha: 0,
      repeat: 0,
      duration: 500
    });
  }



  constructor() {
    super("Game");
  }

  preload() {

    this.canvas = this.game.canvas;
    this.container = this.game.canvas.parentElement!;

    this.canvas.style.transition = "scale .3s ease-in-out";
    this.container.style.transition = "padding-top .3s ease-in-out, background-color .2s ease-in-out";
    this.container.style.backgroundColor = "white";


    AssetManager.registerToScene(this);
    this.compositions.init();
    this.matter.world.setBounds();

    // Load body shapes
    this.load.json("shapes", assetUrl("assets/bricks/shapes.json"));

    (window as any).Scene = this;


  }

  /** Collection of shapes defined in JSON */
  shapes!: {
    [index: string]: Phaser.Types.Physics.Matter.MatterBodyConfig
  };

  create() {

    const canvasWidth = this.game.canvas.width;
    const canvasHeight = window.innerHeight; //this.game.canvas.height;

    this.bg = this.add.rectangle(canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight, 0xffffff, 1);

    window.addEventListener( "mouseout", () => {
      this.bricks.currentlyDraggin.map( brick => brick.fall() );
      this.endDragging();
    } );


    const areaOffsetTop = 70;
    const areaOffsetBottom = canvasHeight * 1 / 3;
    const areaOffsetVertical = 70;

    const areaWidth = canvasWidth - (areaOffsetVertical * 2);
    const areaHeight = canvasHeight - areaOffsetTop - areaOffsetBottom;

    this.area = new Area(this, areaOffsetVertical, areaOffsetTop, areaWidth, areaHeight);

    this.areaTop = areaOffsetTop;
    this.areaBottom = areaOffsetTop + areaHeight;
    this.areaLeft = areaOffsetVertical;
    this.areaRight = areaOffsetVertical + areaWidth;

    this.add.existing(this.area);

    //  Ground
    this.ground = new Ground( this, canvasWidth/2, areaOffsetTop + areaHeight, areaWidth, areaHeight );
    this.add.existing( this.ground );
    this.matter.add.gameObject( this.ground );

    setLoading(false);

    const shapes = this.cache.json.get("shapes");
    this.shapes = shapes;


    this.addBrick(100, 20, "kostka");
    this.addBrick(200, 20, "kruh");
    this.addBrick(300, 20, "kostka");
    this.addBrick(400, 20, "line");
    this.addBrick(500, 20, "kostka");
    this.addBrick(600, 20, "obdelnik");
    this.addBrick(700, 20, "kostka");
    this.addBrick(800, 20, "kruh");
    this.addBrick(50, 100, "kostka");
    this.addBrick(350, 200, "kruh");
    this.addBrick(550, 200, "pacman");
    this.addBrick(750, 200, "kostka");
    this.addBrick(350, 400, "kostka");
    this.addBrick(100, 400, "kostka");
    this.addBrick(200, 400, "line");
    this.addBrick(300, 400, "kostka");
    this.addBrick(400, 400, "kostka");
    this.addBrick(500, 400, "pacman");
    this.addBrick(600, 400, "kostka");
    this.addBrick(700, 400, "obdelnik");
    this.addBrick(800, 400, "kruh");
    this.addBrick(100, 500, "kostka");
    this.addBrick(200, 500, "pacman");
    this.addBrick(300, 500, "kostka");
    this.addBrick(400, 500, "kruh");
    this.addBrick(500, 500, "line");
    this.addBrick(600, 500, "kostka");
    this.addBrick(700, 500, "kostka");
    this.addBrick(800, 500, "kostka");
    this.addBrick(100, 800, "kruh");
    this.addBrick(200, 800, "kostka");
    this.addBrick(300, 800, "polygon");
    this.addBrick(400, 800, "kostka");
    this.addBrick(500, 800, "kruh");
    this.addBrick(600, 800, "kostka");
    this.addBrick(700, 800, "polygon");
    this.addBrick(800, 800, "kostka");

    const sum = {
      width: 0,
      height: 0,
      count: 0,
    };

    this.bricks.map.forEach((brick) => {
      sum.width += brick.width * brick.scale;
      sum.height += brick.height * brick.scale;
      sum.count++;
    });

    sum.width = sum.width / sum.count;
    sum.height = sum.height / sum.count;

    let cursorX = sum.width;
    let cursorY = this.game.canvas.height - sum.height;

    this.bricks.map.forEach((brick) => {
      brick.placeOnPosition(cursorX, cursorY, Math.round(Math.random() * 360));
      if (cursorX + sum.width >= this.game.canvas.width) {
        cursorX = sum.width;
        cursorY -= sum.height;
      } else {
        cursorX += sum.width;
      }
    });

    this.bricks.mount();

    // const rebrick = this.matter.add.gameObject( brick );

    this.matter.add.mouseSpring({
      length: 1,
      stiffness: 0.1,
      // collisionFilter: {
      // group: canDrag
      // }
    });

    EventBus.emit("current-scene-ready", this);
  }

  addBrick(x: number, y: number, textureId: string) {
    this.bricks.add(`brick-${x}-${y}`, x, y, textureId);
  }

  fall() {
    this.bricks.all.forEach((brick) => brick.fall());
    this.markAsCompNone();
  }

  changeScene() {
    this.scene.start("GameOver");
  }

  shuffle() {
    const step = this.game.canvas.height / 6;

    const lowest = this.bricks.all
      .filter((brick) => brick.y > step * 4)
      .sort(() => 0.5 - Math.random());

    lowest.forEach((brick) =>
      brick.applyForce(new Phaser.Math.Vector2(
        (0.5 - Math.random()) * 0.2,
        -0.3 + -0.5 * Math.random())
      )
    );
  }

  protected getTargetScale() {

    return ( window.innerHeight - 100 ) / this.canvas.height;

  }

  public zoomIn() {
    this._isZoomIn = true;
    this.canvas.style.scale = this.getTargetScale().toString();
    this.container.style.paddingTop = "50px";
    this.container.style.backgroundColor = "red";
    EventBus.emit( GameEvents.ZOOM_STATE, true );
  }

  public zoomOut() {
    this._isZoomIn = false;
    this.canvas.style.scale = "1";
    this.container.style.paddingTop = "0px";
    this.container.style.backgroundColor = "white";
    EventBus.emit( GameEvents.ZOOM_STATE, false );
  }

  public deactivateElements() {
    this.game.pause();
    this.bricks.all.forEach( brick => brick.setActive(false) );
  }

  public activateElements() {
    this.game.resume();
    this.bricks.all.forEach( brick => brick.setActive(true) );

  }



}
