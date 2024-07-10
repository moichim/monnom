import Phaser, { Scene } from "phaser";
import { AssetManager } from "../../assets/assetManager";
import { EventBus, GameEvents } from "../EventBus";
import { BrickManager } from "./BrickManager";
import { CompositionManager } from "./CompositionManager";
import { assetUrl } from "../../utils/assetUrl";
import { setLoading } from "../../utils/loader";

export class BricksScene extends Scene {
  camera!: Phaser.Cameras.Scene2D.Camera;
  blockTexture!: Phaser.GameObjects.Image;
  gameText!: Phaser.GameObjects.Text;

  bricks = new BrickManager(this);
  compositions = new CompositionManager(this);

  protected _hasComposition = false;
  public get hasComposition() {
    return this._hasComposition;
  }
  public set hasComposition( value: boolean ) {
    this._hasComposition = value;
    EventBus.emit( GameEvents.HAS_COMPOSITION, value )
  }


  protected _compositionChanged = false;
  public get compositionChanged() {
    return this._compositionChanged;
  }

  public set compositionChanged( value: boolean ) {
    if ( value !== this._compositionChanged ) {
      this._compositionChanged = value;
      EventBus.emit( GameEvents.COMP_CHANGED, value );
    }
  }

  recalculateCompositionState() {
    const anyBrickinComposition = this.bricks.all.find( brick => brick.inComposition );

    if ( anyBrickinComposition && ! this._hasComposition) {
      this.hasComposition = true;
    } else if (!anyBrickinComposition && this._hasComposition) {
      this.hasComposition = false;
    }
  }

  constructor() {
    super("Game");
  }

  preload() {
    AssetManager.registerToScene(this);
    this.compositions.init();
    this.matter.world.setBounds();

    // Load body shapes
    this.load.json("shapes", assetUrl( "assets/bricks/shapes.json") );


  }

  /** Collection of shapes */
  shapes!: {
    [index: string]: Phaser.Types.Physics.Matter.MatterBodyConfig
  };

  create() {

    setLoading( false );

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
    this.compositionChanged = false;
    this.hasComposition = false;
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
}
