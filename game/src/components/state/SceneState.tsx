import { useMemo } from "react";
import { CompositionSnapshotType } from "../../game/scene/CompositionManager";
import { SceneStateBrick } from "./SceneStateBrick";

import styles from "./SceneState.module.scss";

type SceneStateProps = {
    snapshot: CompositionSnapshotType,
    onClick: () => void
}

export const SceneState: React.FC<SceneStateProps> = ({
    snapshot,
    onClick,
    // ...props
}) => {

    const width = useMemo( () => snapshot.dimension.composition.width + 400, [] );
    const height = useMemo( () => snapshot.dimension.composition.height + 400, [] );

    console.log( snapshot );


    return <button onClick={onClick} className={styles.state__button}>

        <svg
        xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} ${height}`}
        >

            {snapshot.bricks.map( brick => <SceneStateBrick key={brick.name} {...brick} center={ new Phaser.Math.Vector2( width / 2, height / 2 ) }/> )}

        </svg>

        <h3>{snapshot.name}</h3>
        <div>{snapshot.person} {snapshot.timestamp}</div>

    </button>

}