import { useMemo } from "react";
import { CompositionSnapshotType } from "../../game/objects/CompositionManager";
import { SceneStateBrick } from "./SceneStateBrick";

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


    return <button onClick={onClick} style={{width: 200, background: "white", display: "inine-block"}}>

        <svg
            // width={width}
            // height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
        >

            {snapshot.bricks.map( brick => <SceneStateBrick key={brick.name} {...brick} center={ new Phaser.Math.Vector2( width / 2, height / 2 ) }/> )}

        </svg>

    </button>

}