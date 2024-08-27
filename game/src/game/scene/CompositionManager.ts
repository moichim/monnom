import Phaser from "phaser";
import { v4 as uuid } from "uuid";
import { apiUrl } from "../../utils/assetUrl";
import { EventBus, GameEvents } from "../EventBus";
import { Brick, BrickMovements } from "../objects/Brick";
import { BricksScene } from "./BricksScene";

export type CompositionSnapshotType = ReturnType<CompositionManager["getCurrentSceneSnapshot"]>;


/** Manages composition retrieval */
export class CompositionManager {

    protected readonly bricks = this.scene.bricks;
    protected dimensions!: ReturnType< CompositionManager["getSceneDimension"]>

    protected _compositions: CompositionSnapshotType[] = [];

    /** Get all the stored compositions loaded from the backend. */
    public get compositions() { return this._compositions; }

    /** Store the loaded compositions and emit them in an event */
    protected storeCompositions( data: CompositionSnapshotType[] ) {
        this._compositions = data;
        if ( this._compositions.length > 0 ) {
            EventBus.emit( GameEvents.COMPS_LOADED, this.compositions );
        }
    }

    constructor(
        protected readonly scene: BricksScene
    ) {

    }

    protected readonly store: Map<string,CompositionSnapshotType> = new Map();

    public async init() {
        this.dimensions = this.getSceneDimension();
        // Load saved compositions from the API
        this.storeCompositions( await this.getStoredCompositions() );
    }

    public async getStoredCompositions() {
        const result = await fetch( apiUrl( "/wp-json/monnom/v1/all" ) );
        const json = await result.json() as {
            message: string,
            data: CompositionSnapshotType[]
        };

        return json.data;
    }


    storeCurrentComposition(
        name: string,
        person: string
    ) {

        const bricks = this.bricks.currentlyInComposition;

        if ( bricks.length === 0 ) {
            console.error( "There are no bricks in composition right now!" );
            return;
        }

        const snapshot = this.getCurrentSceneSnapshot();
        snapshot.name = name;
        snapshot.person = person;

        this.store.set( snapshot.id, snapshot );

        

        fetch( apiUrl( "/wp-json/monnom/v1/store" ), {
            method: "POST",
            body: JSON.stringify( snapshot )
        } )
            .then( response => {
                EventBus.emit( GameEvents.COMP_STORED, snapshot );
                this.scene.markAsHasComposition();
                return response.json();
            })
            .then( console.log )
            .catch(console.log);

    }


    protected getCurrentSceneSnapshot() {

        const bricks = this.bricks.currentlyInComposition;
        const center = bricks.reduce( (
            state,
            current
        ) => {

            return state.add( new Phaser.Math.Vector2( current.x, current.y ) )

        }, new Phaser.Math.Vector2( 0, 0 ) ).divide( new Phaser.Math.Vector2( bricks.length, bricks.length ) );

        const stored = bricks.map( brick => {

            return brick.getStoreData( center );

        } );

        const bounds = stored.reduce( (state, current) => {

            const st = {...state};

            if ( current.position.relative.x < state.minX)
                st.minX = current.position.relative.x;
            if ( current.position.relative.x > state.maxX )
                st.maxX = current.position.relative.x;
            if ( current.position.relative.y < state.minY ) 
                st.minY = current.position.relative.y;
            if ( current.position.relative.y > state.maxY )
                st.maxY = current.position.relative.y;

            return st;

        }, { minX: this.dimensions.width, minY: this.dimensions.height, maxX: 0, maxY: 0 } );

        const dimension = {
            width: bounds.maxX - bounds.minX,
            height: bounds.maxY - bounds.minY
        }

        return {
            bricks: stored,
            dimension: {
                scene: {
                    width: this.scene.game.canvas.width,
                    height: this.scene.game.canvas.height
                },
                composition: dimension,
                bounds,
            },
            id: uuid(),
            name: undefined as unknown as string,
            timestamp: (new Date).getTime(),
            person: undefined as unknown as string
        }
    }


    protected getSceneDimension() {
        const width = this.scene.game.canvas.width;
        const height = window.innerHeight;// this.scene.game.canvas.height;
        const diagonal = width + height / 2;

        const center = new Phaser.Math.Vector2(
            width / 2,
            height / 2
        );

        return {
            width,
            height,
            diagonal,
            center
        }
    }

    protected getPositionRelativeToCenter( brick: Brick ): Phaser.Math.Vector2 {

        const current = new Phaser.Math.Vector2( brick.x, brick.y );

        const converted = current.subtract( this.dimensions.center );

        return converted;
    }


    public restoreSnapshot( snapshot: CompositionSnapshotType, mode: BrickMovements ) {

        this.scene.markAsCompNone();

        // Do nothing if snapshot does not exist

        // All bricks should fall
        this.bricks.all.forEach( brick => brick.fall() );

        // All affected bricks should ho to position
        snapshot.bricks.forEach( brickState => {

            const brick = this.bricks.map.get( brickState.name )
            
            if ( brick ) {

                const newPosition = this.dimensions.center.clone()
                    .add( brickState.position.relative )
                    .add( new Phaser.Math.Vector2( 
                        0, 
                        -1 * this.dimensions.height / 7 
                        ) 
                    );

                // const newPosition = brickState.position.absolute;

                if (mode === BrickMovements.NATURAL ) {
                    brick.movement.natural( newPosition.x, newPosition.y, brickState.angle );
                } 
                
                /*
                else if ( mode === BrickMovements.JUMP ) {
                    brick.movement.tween( newPosition.x, newPosition.y, brickState.angle )
                }*/
                 else if ( mode === BrickMovements.SWAP ) {
                    brick.movement.swap( newPosition.x, newPosition.y, brickState.angle );
                }

            }

        } );

    }

}