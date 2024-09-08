import { BricksScene } from "../game/scene/BricksScene";
import { assetUrl } from "../utils/assetUrl";

type AssetDefinition = {
    url: string,
    key: string
}

const defs = new Map<string,AssetDefinition>();

const register = (
    key: string,
    url: string
) => {
    defs.set( key, { 
        key, 
        url: assetUrl( url )
    } );
}

// 
register( "kostka", "assets/bricks/kostka.png" );
register( "kruh", "assets/bricks/kruh.png" );
register( "lichobeznik", "assets/bricks/lichobeznik.png" );
register( "line", "assets/bricks/line.png" );
register( "obdelnik", "assets/bricks/obdelnik.png" );
register( "pacman", "assets/bricks/pacman.png" );
register( "polygon", "assets/bricks/polygon.png" );
register( "ground", "assets/ground.png" );

let from = 1;
let to = 33;

for ( let i = from; i <= to; i++ ) {
    register( 
        i.toString(),
        `assets/polygons/${i}.png` 
    );
}

export class AssetManager {

    static assets = defs;

    static registerToScene( scene: BricksScene ) {
        AssetManager.assets.forEach( item => {
            scene.load.image( item.key, item.url );
        } );
    }

    static get( key: string ) {
        return AssetManager.assets.get( key );
    }

    static getUrl( key: string ) {
        return AssetManager.get( key )?.url;
    }

}