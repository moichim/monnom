import { Game } from "phaser";

type Size = {
    topOffset: number,
    breakpoint: number,
    aspect: number,
    aspectNegative: number
    offset: number,
    centerAspect: number
}

export class Sizing {

    public static bricksArea = 1454690 / 2.25  + ( 100000 );

    public static breakpoints: Array<Size> = [
        {
            topOffset: 100,
            breakpoint: 1000,
            aspect: 1.3,
            offset: 100 * 1.3,
            aspectNegative: 0.75,
            centerAspect: 5
        },
        {
            topOffset: 130,
            breakpoint: 500,
            aspect: 1.5,
            aspectNegative: 0.6,
            offset: 100 * 1.5,
            centerAspect: 5
        }
    ]

    public static default: Size = {
        topOffset: 70,
        breakpoint: Infinity,
        aspect: 1,
        offset: 100,
        aspectNegative: 1,
        centerAspect: 6
    }

    public static getBreakpoint() {
        let breakpoint: Size = Sizing.default;

        Sizing.breakpoints.forEach( size => {
            if ( window.innerWidth < size.breakpoint ) {
                    breakpoint = size;
            }
        } );

        return breakpoint;
    }


    public static areaOffsetTop = Sizing.getBreakpoint().topOffset;
    public static areaOffsetBottom = window.innerHeight * 1/3;
    public static areaOffsetVertical = 70;

    public static calculateCanvasDimensions() {

        const size = Sizing.getBreakpoint();

        let h = window.innerHeight * size.aspect;
        let w = window.innerWidth * size.aspect;

        const windowArea = w * h;

        const targetFreeArea = windowArea * 4 / 5;

        const totalArea = targetFreeArea + Sizing.bricksArea;

        return {
            width: w,
            height: totalArea / w,
            size: size
        }

        



    }

    public static storeCanvasDimensions( value: ReturnType<typeof Sizing["calculateCanvasDimensions"]> ) {
        (window as any).gameDimensions = value;
    }

    public static getCanvasDimensions() {
        const dimensions: ReturnType<typeof Sizing["calculateCanvasDimensions"]>|undefined = (window as any).gameDimensions;

        if ( dimensions === undefined ) {
            throw new Error( "dimensions not set!!!" );
        }

        return dimensions;
    }

    public static storeGame( game: Game ) {
        (window as any).Game = game;
    }

    public static getGame() {
        const game: Game|undefined = (window as any).Game;
        if (game=== undefined) {
            throw new Error( "game not stored in the window!!!" );
        }
        return game;
    }

    public static hasOffcanvasOpen() {
        const has: boolean|undefined = (window as any).hasOffcanvasOpen;

        if ( has === undefined ) {
            return false;
        }
        return has;
    }

    public static setOffcanvasOpen( value: boolean ) {
        (window as any).hasOffcanvasOpen = value;
    }

}