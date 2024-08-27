import Phaser, { Scene } from "phaser";
import { AssetManager } from "../../assets/assetManager";
import { EventBus, GameEvents } from "../EventBus";
import { BrickManager } from "./BrickManager";
import { CompositionManager } from "./CompositionManager";
import { assetUrl } from "../../utils/assetUrl";
import { setLoading } from "../../utils/loader";
import { Area } from "../objects/Area";
import { Ground } from "../objects/Ground";
import { Wall } from "../objects/Wall";
import { Sizing } from "../../utils/sizing";

export enum CompositionState {
  NONE,
  HAS,
  CHANGED
}

export class BricksScene extends Scene {

  protected dimensions = Sizing.getCanvasDimensions();

  protected initialScale!: number;

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
  walls: {
    top?: Wall,
    bottom?: Wall,
    left?: Wall,
    right?: Wall
  } = {};
  public categories!: {
    base:number,
    ground: number,
    composition: number
  };

  areaLeft!: number;
  areaRight!: number;
  areaTop!: number;
  areaBottom!: number;

  public bg!: Phaser.GameObjects.Rectangle;
  protected bgTween!: Phaser.Tweens.Tween;

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

    this.createCollisionCategories();
    this.calculateDimensions();

    this.initialScale = window.innerWidth / this.canvasWidth;


  }

  /** Collection of shapes defined in JSON */
  shapes!: {
    [index: string]: Phaser.Types.Physics.Matter.MatterBodyConfig
  };

  canvasWidth!: number;
  canvasHeight!: number;
  windowHeight!: number;
  areaOffsetTop!: number;
  areaOffsetBottom!: number;
  areaOffsetVertical!: number;
  areaWidth!: number;
  areaHeight!: number;

  spring!: MatterJS.ConstraintType;

  cursor!: Phaser.Physics.Matter.Sprite;

  

  create() {

    /*
    this.matter.world.addListener( Phaser.Input.Events.POINTER_MOVE, console.log );

    

    const cursor = this.matter.add.sprite( this.canvasWidth / 2, this.windowHeight / 2, "ground" );

    cursor.setStatic( true );

    cursor.setDisplaySize( 10,10 );

    this.canvas.addEventListener( "mousemove", event => {

      console.log( this.isZoomIn, event );

      cursor.setPosition( event.layerX, event.layerY );
    } );

    this.cursor = cursor;

    */


    const options = {
      length: 1,
      stiffness: 1,
      // eslint-disable-next-line
      collisionFilter: {
        group: this.categories.base
      }
    };
    


    
    this.spring = this.matter.add.mouseSpring(options);
    

    this.bg = this.add.rectangle(this.canvasWidth / 2, this.canvasHeight / 2, this.canvasWidth, this.canvasHeight, 0xffffff, 1);

    window.addEventListener( "mouseout", () => {
      this.bricks.currentlyDraggin.map( brick => brick.fall() );
      this.endDragging();
    } );

    this.area = new Area(this, this.areaOffsetVertical, this.areaOffsetTop, this.areaWidth, this.areaHeight);

    this.add.existing(this.area);
    
    this.buildGroud();

    this.buildWalls();

    setLoading(false);

    this.buildBricks();

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
        -0.9 + ( -0.5 * Math.random() ))
      )
    );
  }

  protected getTargetScale() {


    const height = this.canvasHeight * this.dimensions.size.aspectNegative;

    const offset = this.dimensions.size.offset;

    const targetSize = (window.innerHeight - offset) / height;
    /*
    const height = this.isSmall 
      ? this.canvasHeight * 0.75
      : this.canvasHeight;

    const offset = this.isSmall
      ? 100 * 1.3
      : 100;
      */

    console.log( targetSize, this.dimensions );

    return targetSize;

  }

  public zoomIn() {
    this._isZoomIn = true;
    this.canvas.style.scale = this.getTargetScale().toString();
    this.container.style.paddingTop = "50px";
    this.container.style.backgroundColor = "lightgray";
    EventBus.emit( GameEvents.ZOOM_STATE, true );
  }

  public zoomOut() {
    this._isZoomIn = false;

    this.canvas.style.scale = "1";//;this.initialScale.toString();
    this.canvas.style.width = "100%";
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

  protected calculateDimensions() {

    this.canvasWidth = this.game.canvas.width;
    this.canvasHeight = this.game.canvas.height;
    this.windowHeight = window.innerHeight;

    this.areaOffsetTop = 70;
    this.areaOffsetBottom = this.windowHeight * 1 / 3;
    this.areaOffsetVertical = 70;

    this.areaWidth = this.canvasWidth - (this.areaOffsetVertical * 2);
    this.areaHeight = ( this.windowHeight - this.areaOffsetTop - this.areaOffsetBottom ) * this.dimensions.size.aspect;

    this.areaTop = this.areaOffsetTop;
    this.areaBottom = this.areaOffsetTop + this.areaHeight;
    this.areaLeft = this.areaOffsetVertical;
    this.areaRight = this.areaOffsetVertical + this.areaWidth;

  }

  protected createCollisionCategories() {
    this.categories = {
      base: this.matter.world.nextCategory(),
      ground: this.matter.world.nextCategory(),
      composition: this.matter.world.nextCategory()
    }
  }




  protected buildWalls() {

    const wallThickness = 50;
    const wallOffset = wallThickness / 2;
    const wallX = this.canvasWidth / 2;
    const wallWidth = this.canvasWidth * 2;
    const wallY = this.canvasHeight / 2;
    const wallHeight = this.canvasHeight * 2;

    this.walls.top = new Wall(
      this,
      wallX,
      - wallOffset,
      wallWidth,
      wallThickness
    );

    this.walls.bottom = new Wall(
      this,
      wallX,
      this.canvasHeight + wallOffset,
      wallWidth,
      wallThickness
    );

    this.walls.left = new Wall(
      this,
      -wallOffset,
      wallY,
      wallThickness,
      wallHeight
    );

    this.walls.right = new Wall(
      this,
      this.canvasWidth + wallOffset,
      wallY,
      wallThickness,
      wallHeight
    );

  }

  protected buildGroud() {

    this.ground = new Ground( 
      this, 
      this.canvasWidth/2, 
      this.areaOffsetTop + ( this.areaHeight / 6 * 5 ), 
      this.areaWidth, 
      20
    );
  }

  protected buildBricks() {

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

  }



}
