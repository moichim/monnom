import { useMemo } from "react";
import { Brick } from "../../game/objects/Brick";
import { AssetManager } from "../../assets/assetManager";

export type SceneStateBrickProps = ReturnType<Brick["getStoreData"]> & {
  center: Phaser.Math.Vector2
};

export const SceneStateBrick: React.FC<SceneStateBrickProps> = (props) => {
  const url = useMemo(
    () => AssetManager.getUrl(props.textureKey),
    [props.textureKey]
  );

  const x = useMemo( () => { return props.position.relative.x + props.center.x }, [props.position.relative] );

  const y = useMemo( () => { return props.position.relative.y + props.center.y }, [props.position.relative] );

  return (
    <g
        // transform={` translate( ${x} ${y} ) `}
        // x={props.position.absolute.x}
        // y={props.position.absolute.y}
        style={{
            transformOrigin: "center center"
        }}
    >
      <image
        href={url}
        // x={props.position.absolute.x}
        // y={props.position.absolute.y}
        transform={` 
          translate( ${x} ${y} )
        scale( ${props.scale} ${props.scale} ) 
        rotate( ${props.angle} ${props.position.absolute.x / 2} ${
          props.position.absolute.y / 2
        } ) `}
        style={
          {
            // transformOrigin: "center center"
          }
        }
      />
    </g>
  );
};
