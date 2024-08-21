import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Offcanvas, useOffcanvas } from "../ui/offcanvas";
import styles from "./CompositionStoreButton.module.scss";

import 'altcha';
import { createPortal } from "react-dom";

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

    const [may, setMay] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>( 0 );

    const disabled = useMemo(() => {

        return !(stringIsNotNull(message) && stringIsNotNull(person));

    }, [message, person]);

    useEffect(() => {
        setMessage(undefined);
    }, [offcanvas.isOpen, setMessage]);

    const [hover, setHover] = useState<boolean>(false);

    const container = useMemo( () => {
        const gameRoot = document.getElementById("gameRoot");
        if ( ! gameRoot ) throw new Error( "GameRoot not found!" );
        return gameRoot.parentElement;
    }, [] );
    

    const successHandler = () => {
        if (message && person) {
            offcanvas.close();
            props.fn(message, person);

            const widgets = document.getElementsByTagName("altcha-widget");

            for ( let widget of widgets ) {
                widget.remove();
            }

            setMay( false );
            setCounter( 30 );

        }
    };


    useEffect( () => {

        if ( counter > 0 ) {
            const timer = setTimeout( () => {
                setCounter( counter - 1 );
            }, 1000 );

            return () => { clearTimeout( timer ) }
        } else {
            setMay( true );
            setCounter( 0 );
            setPerson("");
            setMessage("");
        }

    }, [counter] );


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

        {props.on && createPortal( <Offcanvas label="Save your composition!" control={offcanvas}>

            {may === false && counter > 0
                ? <div className={styles.composition_close__wrapper}>
                    <div>You have submitted a design recently.</div>
                    <div>Please, wait <strong>{counter}s</strong> before submitting another one.</div>
                    <div style={{
                        width: "100%",
                        backgroundColor: "white",
                        height: "2px"
                    }}>
                        <div style={{
                            width: `${counter / 30 * 100}%`,
                            height: "2px",
                            backgroundColor: "black",
                            float: "right"
                        }}></div>
                    </div>
                </div>
                : <div 
                className={styles.composition_close__wrapper} 
            >

                <div>Send us your creation and share it with other visitors of our site!</div>

                <input
                    onChange={event => setMessage(event.target.value)}
                    placeholder="Your message"
                    value={message}
                ></input>

                <input
                    onChange={event => setPerson(event.target.value)}
                    placeholder="Your nickname"
                    value={person}
                ></input>

                <button 
                    onClick={successHandler}
                    disabled={disabled}
                    // type="submit"
                >Submit</button>

            </div>
            }

        </Offcanvas>, container! )}
    </>

}