import classNames from "classnames";
import React, { PropsWithChildren, RefObject, useCallback, useEffect, useState } from "react";
import { useScrollShadow } from "use-scroll-shadow";

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

    const { elementRef, wrapperRef } = useScrollShadow();

    useEffect( () => {

        const action = (event: KeyboardEvent) => {
            if ( event.key === "Escape" )
            props.control.close()
        }

        document.addEventListener( "keydown" , action );

        return () => { document.removeEventListener( "keydown", action ) }

    }, [props.control] );

    return <>
        <div className={classes}>

            <div className="monnom-offcanvas__backdrop" onClick={props.control.close}></div>

            <article className="monnom-offcanvas__content">
                <header className="monnom-offcanvas__content__header">
                    <h2>{props.label}</h2>
                    <button onClick={props.control.close}>X</button>
                </header>

                <main className="monnom-offcanvas__content__scroller" ref={wrapperRef}>

                    <div ref={elementRef as RefObject<HTMLDivElement>} style={{ overflowY: 'auto', maxHeight: 'calc( 100% - 4rem )' }}>
                        {props.children}
                    </div>
                </main>
            </article>

        </div>
    </>


}