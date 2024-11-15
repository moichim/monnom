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

register( "ground", "assets/ground.png" );

let from = 1;
let to = 35;

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