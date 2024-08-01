import React, { useState } from "react";
import styles from "./CompositionShuffleButton.module.scss";
import classNames from "classnames";

type CompositionClearButtonProps = {
    fn: () => void,
    on: boolean
}

export const CompositionShuffleButton: React.FC<CompositionClearButtonProps> = props => {

    const [hover, setHover] = useState<boolean>(false);

    return <div className={styles.composition_close} data-on={props.on} onClick={props.fn}>
        <div className={classNames(hover ? styles.label__on : styles.label__off, styles.label)}>
            Shuffle
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>

    </div>

}