import classNames from "classnames";
import React, { PropsWithChildren, useCallback, useState } from "react";

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

    return <>
        <div className={classes}>

            <div className="monnom-offcanvas__backdrop" onClick={props.control.close}></div>

            <article className="monnom-offcanvas__content">
                <header className="monnom-offcanvas__content__header">
                    <h2>{props.label}</h2>
                    <button onClick={props.control.close}>X</button>
                </header>

                <main className="monnom-offcanvas__content__scroller">
                    {props.children}
                </main>
            </article>

        </div>
    </>


}