import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Offcanvas, useOffcanvas } from "../ui/offcanvas";
import styles from "./CompositionStoreButton.module.scss";

type CompositionClearButtonProps = {
    fn: (name: string, person: string) => void,
    on: boolean
}

const stringIsNotNull = (value: string | undefined | null) => {
    if (!value) {
        return false;
    }
    return value.length > 0 && value !== "";
}

export const CompositionStoreButton: React.FC<CompositionClearButtonProps> = props => {

    const offcanvas = useOffcanvas();

    const [message, setMessage] = useState<string>();
    const [person, setPerson] = useState<string>();

    const disabled = useMemo(() => {

        return !(stringIsNotNull(message) && stringIsNotNull(person));

    }, [message, person]);

    useEffect(() => {
        setMessage(undefined);
    }, [offcanvas.isOpen, setMessage]);

    const [hover, setHover] = useState<boolean>(false);

    return <>
        <div className={styles.composition_close} data-on={props.on} role="button" >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="size-6"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)} onClick={() => {
                    offcanvas.open();
                    setHover(false);
                }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <div className={classNames(hover ? styles.label__on : styles.label__off, styles.label)}>
                Save your creation
            </div>
        </div>

        <Offcanvas label="Save your composition!" control={offcanvas}>

            <div className={styles.composition_close__wrapper}>

                <div>Send us your creation and share it with other visitors of our site!</div>

                <textarea
                    onChange={event => setMessage(event.target.value)}
                    placeholder="Your message"
                    value={message}
                ></textarea>

                <input
                    onChange={event => setPerson(event.target.value)}
                    placeholder="Your nickname"
                    value={person}
                ></input>

                <button onClick={() => {
                    if (message && person) {
                        offcanvas.close();
                        props.fn(message, person);
                    }
                }}
                    disabled={disabled}
                >Uložit</button>

            </div>

        </Offcanvas>
    </>

}