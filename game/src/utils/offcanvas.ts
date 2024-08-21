import { BricksScene } from "../game/scene/BricksScene";

export const classOpen = "monnom-offcanvas__open";
const classClosed = "monnom-offcanvas__close";


export const createOffcanvas = (
    triggerId: string,
    offcanvasId: string,
    full: boolean = false
) => {

    const trigger = document.getElementById( triggerId );
    const container = document.getElementById( offcanvasId );

    if ( container === null || trigger === null ) {
        throw new Error( `Offcanvas container '${offcanvasId}' or trigger '${triggerId}' not found!` );
    }

        container.classList.add(
            full 
                ? "monnom-offcanvas__full"
                : "monnom-offcanvas__constrained"
        );


        const open = () => {
            container.classList.remove( classClosed );
            container.classList.add( classOpen );
            container.removeAttribute( "aria-hidden" );
            ( (window as any).Scene as BricksScene ).deactivateElements();
        }

        const close = () => {
            container.classList.remove( classOpen );
            container.classList.add( classClosed );
            container.setAttribute( "aria-hidden", "true" );
            ( (window as any).Scene as BricksScene ).activateElements();
        }

        trigger.addEventListener( "click", open );

        const closeButton = container.querySelector( ".monnom-offcanvas__content__header button" )!;

        closeButton.addEventListener( "click", close );

        const backdrop = container.querySelector( ".monnom-offcanvas__backdrop" )!;

        backdrop.addEventListener( "click", close );

        document.onkeydown = event => {
            if ( event.key === "Escape" )  {
                close();
            }
        }

        let isOpen = container.classList.contains( classOpen );

        return {
            open,
            close,
            isOpen,
            container
        }

}