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

  const x = useMemo( () => { 
    return props.position.relative.x  
    + props.center.x
    - ( props.width * props.originX )
  }, [props.position.relative] );

  const y = useMemo( () => { 
    return props.position.relative.y 
    + props.center.y 
    - ( props.height * props.originY )
  }, [props.position.relative] );

  const rotateCenterX = useMemo( () => {
    return props.width * props.originX
  }, [] );

  const rotateCenterY = useMemo( () => {
    return props.height * props.originY
  }, [] );

  console.log( props );

  return (

    <g
      transform={`translate( ${x} ${y} )`}
      transform-origin={
        "center center"
      }
    >
      <image
        href={url}
       transform={`rotate( ${props.angle} ${rotateCenterX } ${rotateCenterX} )`}
       
       stroke="black"
       strokeWidth={4}
       rotate={"300"}
       scale={1}
        style={
          {
            // transformOrigin: "50% 50%",
            stroke: "red",
            fill: "green",
            strokeWidth: "4"
            // transform: "translate(200 200)"
            /*
            transform: `
              scale( ${props.scale} ${props.scale} )
              rotate( ${props.angle} )
              translate( ${props.position.absolute.x} )
            `
            */
          }
        }
      />

</g>
  );
};
