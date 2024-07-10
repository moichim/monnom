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

    return props.compositions.filter(composition => {
      console.log(composition.dimension.composition);
      return composition.dimension.composition.width < (width - 100)
        && composition.dimension.composition.height < (height - 200)
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