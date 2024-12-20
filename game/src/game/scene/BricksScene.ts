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
import { PhysicsParams } from "../../utils/physics";

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
    this.matter.world.setGravity( 0, PhysicsParams.world.gravity );

    // Load body shapes
    this.load.json("shapes", assetUrl("assets/polygons/shapes.json"));

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


  protected innerRegistry: Map<string,number> = new Map;

  destroy() {
    this.innerRegistry.clear();
  }


  addBrick(x: number, y: number, textureId: string) {

    let index = 0;

    if ( this.innerRegistry.has( textureId ) ) {
      index = this.innerRegistry.get( textureId )!;
      this.innerRegistry.set( textureId, index + 1 );
    } else {
      this.innerRegistry.set( textureId, 1 );
    }

    this.bricks.add(`brick-${textureId}-${index}`, x, y, textureId);
  }

  fall() {
    this.bricks.all.forEach((brick) => brick.fall());
    this.markAsCompNone();
  }

  changeScene() {
    this.scene.start("GameOver");
  }

  shuffle() {

    const lowest = this.bricks.all
      // .filter((brick) => brick.y > step)
      .sort(() => 0.8 - Math.random());

    lowest.forEach((brick) =>
      brick.applyForce( ( new Phaser.Math.Vector2(
        (0.5 - Math.random()) * 0.2,
        -0.9 + ( -0.5 * Math.random() )
      ) ).multiply( new Phaser.Math.Vector2( 
        PhysicsParams.game.shuffleAmount,
        PhysicsParams.game.shuffleAmount 
      ) )
      )
    );
  }

  protected getTargetScale() {


    const height = this.canvasHeight * this.dimensions.size.aspectNegative;

    const offset = this.dimensions.size.offset;

    const targetSize = (window.innerHeight - offset) / height;

    return targetSize;

  }

  public zoomIn() {
    this._isZoomIn = true;
    this.canvas.style.scale = this.getTargetScale().toString();
    this.container.style.paddingTop = "50px";
    this.container.style.backgroundColor = "#e6e6e6";
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

    this.areaOffsetTop = Sizing.areaOffsetTop;
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

    let from = 1;
    let to = 35;
    let square = 200;
    // let wWidth = window.innerWidth; 
    let canvasHeight = this.canvasHeight;

    // let row = 0;
    // let column = 0;

    let maxX = Math.floor( window.innerWidth / square );

    let pointerX = 0;
    let pointerY = 0;

    const numbers: number[] = [];
    for ( let i = from; i <= to; i++ ) {
      numbers.push( i );
    }

    numbers.sort( () => Math.random() - .5 );

    for ( let i of numbers ) {

    // for ( let i = from; i <= to; i++ ) {

      const y = canvasHeight - ( pointerY * square ) + ( square / 2 );
      const x = square * pointerX + ( square / 2 );

      this.addBrick( x, y, i.toString() );
      
      if ( pointerX === maxX ) {
        pointerX = 0;
        pointerY = pointerY + 1;
      } else {
        pointerX = pointerX + 1;
      }

    }

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
