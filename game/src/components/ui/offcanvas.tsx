import classNames from "classnames";
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export const useOffcanvas = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const open = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);

    const close = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return {
        isOpen,
        open,
        close
    }
}

type OffcanvasProps = PropsWithChildren & {
    label: React.ReactNode,
    control: ReturnType<typeof useOffcanvas>
}


export const Offcanvas: React.FC<OffcanvasProps> = props => {

    const classes = classNames("monnom-offcanvas", props.control.isOpen ? "monnom-offcanvas__open" : "monnom-offcanvas__close");

    useEffect( () => {

        const action = (event: KeyboardEvent) => {
            if ( event.key === "Escape" )
            props.control.close()
        }

        document.addEventListener( "keydown" , action );

        return () => { document.removeEventListener( "keydown", action ) }

    }, [props.control] );

    const container = useMemo( () => {
        const gameRoot = document.getElementById("gameRoot");
        if ( ! gameRoot ) throw new Error( "GameRoot not found!" );
        return gameRoot.parentElement;
    }, [] );

    return createPortal(
    
        <aside className={classes} aria-hidden={props.control.isOpen === false} aria-label={props.label?.toString()}>

            <div className="monnom-offcanvas__backdrop" onClick={props.control.close} aria-hidden="true"></div>

            <article className="monnom-offcanvas__content">
                <header className="monnom-offcanvas__content__header">
                    <h2>{props.label}</h2>
                    <button onClick={props.control.close}>×</button>
                </header>

                <main className="monnom-offcanvas__content__scroller">
                    {props.children}
                </main>
            </article>

        </aside>
    
    , container!)


}