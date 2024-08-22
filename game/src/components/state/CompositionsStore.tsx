import React, { useMemo } from "react";
import { useWindowSize } from "usehooks-ts";
import { CompositionSnapshotType } from "../../game/scene/CompositionManager";
import { SceneState } from "./SceneState";

type CompositionStoreProps = {
    compositions: CompositionSnapshotType[];
    restore: (composition: CompositionSnapshotType) => void;
    onRestore?: () => void;
  };

export const CompositionStore: React.FC<CompositionStoreProps> = props => {

    const { width = 0, height = 0 } = useWindowSize();

  const filtered = useMemo(() => {

    const isSmall = (window as any).isSmall as boolean;

    const aspect = isSmall
      ? 1.3
      : 1;

    return props.compositions.filter(composition => {
      return composition.dimension.composition.width < ( ( width * aspect ) - 100)
        && composition.dimension.composition.height < ( ( height * aspect ) - 100)
      // && composition.dimension.composition.width > ( width - 200 )
      // && composition.dimension.composition.height > ( height - 200 )
    })

  }, [width, height, props.compositions]);

  return <>
  
    {filtered.map( composition => {
        return <SceneState
            key={composition.id}
            onClick={() => {
                props.restore( composition );

                if ( props.onRestore ) {
                    props.onRestore();
                }
            }}
            snapshot={composition}
        ></SceneState>
    } )}
  
  </>

}