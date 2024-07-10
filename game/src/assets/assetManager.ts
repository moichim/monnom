import { BricksScene } from "../game/scene/BricksScene";

type AssetDefinition = {
    url: string,
    key: string
}

const defs = new Map<string,AssetDefinition>();

const isLocal = window.location.href.includes( "localhost:5173" );

const urlPrefix = isLocal ? "" : "/wp-content/themes/monnom/game/";

const register = (
    key: string,
    url: string
) => {
    defs.set( key, { 
        key, 
        url: urlPrefix + url 
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