import React, { useEffect, useMemo, useState } from "react";
import styles from "./CompositionStoreButton.module.scss";
import { Offcanvas, useOffcanvas } from "./ui/offcanvas";

type CompositionClearButtonProps = {
    fn: (name: string) => void,
    on: boolean
}

export const CompositionStoreButton: React.FC<CompositionClearButtonProps> = props => {

    const offcanvas = useOffcanvas();

    const [message, setMessage] = useState<string>();

    const disabled = useMemo(() => {

        if (message === undefined) {
            return true;
        }

        else if (message.length === 0) {
            return true;
        }

        else if (message === "") {
            return true;
        }

        return false;

    }, [message]);

    useEffect( () => {
        setMessage( undefined );
    }, [offcanvas.isOpen, setMessage] );

    return <>
        <div className={styles.composition_close} data-on={props.on} onClick={() => {
            offcanvas.open();
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
        </div>
        <Offcanvas label="Uložit kompozici" control={offcanvas}>

            <div>Uložit kompozici?</div>

            <textarea onChange={event => setMessage(event.target.value)}></textarea>

            <div>{message}</div>

            <button onClick={() => {
                if (message) {
                    offcanvas.close();
                    props.fn(message);
                }
            }}
                disabled={disabled}
            >Uložit</button>

        </Offcanvas>
    </>

}