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

    const width = useMemo( () => snapshot.dimension.scene.width, [] );
    const height = useMemo( () => snapshot.dimension.scene.height, [] );


    return <button onClick={onClick} className={styles.state__button}>

        <svg
            // width={width}
            // height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
        >

            {snapshot.bricks.map( brick => <SceneStateBrick key={brick.name} {...brick} center={ new Phaser.Math.Vector2( width / 2, height / 2 ) }/> )}

        </svg>

        <h3>{snapshot.name}</h3>
        <div>{snapshot.person} {snapshot.timestamp}</div>

    </button>

}