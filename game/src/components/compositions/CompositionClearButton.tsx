import React, { useState } from "react";
import styles from "./CompositionClearButton.module.scss";
import classNames from "classnames";

type CompositionClearButtonProps = {
    fn: () => void,
    on: boolean
}

export const CompositionClearButton: React.FC<CompositionClearButtonProps> = props => {

    const [hover, setHover] = useState<boolean>(false);

    return <div className={styles.composition_close} data-on={props.on} onClick={props.fn}>
        <div className={classNames(hover ? styles.label__on : styles.label__off, styles.label)}>
            Clear
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    </div>

}