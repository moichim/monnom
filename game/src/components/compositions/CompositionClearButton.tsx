import classNames from "classnames";
import React from "react";
import { ButtonWithPopover } from "../ui/ButtonWithPopover";
import styles from "./CompositionClearButton.module.scss";

type CompositionClearButtonProps = {
    fn: () => void,
    on: boolean
}

export const CompositionClearButton: React.FC<CompositionClearButtonProps> = props => {

    return <div className={styles.composition_close} data-on={props.on} onClick={props.fn}>
        <div className={classNames(styles.label)}>
            Clear
        </div>
        <ButtonWithPopover
            content={<>Clear the composition</>}
            onClick={props.fn}
            breakpoint={600}
            below={{ position: "right", style: { display: "none" } }}
            above={{ position: "right" }}
            className={styles.button}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </ButtonWithPopover>
    </div>

}