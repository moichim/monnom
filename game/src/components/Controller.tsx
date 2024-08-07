import React, { useEffect, useMemo, useRef, useState } from "react";
import { EventBus } from "../game/EventBus";
import { BrickMovements } from "../game/objects/Brick";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { BricksScene } from "../game/scene/BricksScene";
import { CompositionSnapshotType } from "../game/scene/CompositionManager";
import { MovementRadio } from "./movement/movementRadio";

import { createPortal } from "react-dom";
import { CompositionClearButton } from "./compositions/CompositionClearButton";
import { CompositionStoreButton } from "./compositions/CompositionStoreButton";
import styles from "./Controller.module.css";
import { CompositionStore } from "./state/CompositionsStore";
import { Offcanvas, useOffcanvas } from "./ui/offcanvas";
import { useController } from "./useController";

export const Controller: React.FC = () => {
  const [movement, setMovement] = useState<BrickMovements>(
    BrickMovements.SWAP
  );


  const controller = useController();


  // Reference to the Phaser instance
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  // Reference to the scene
  const [scene, setScene] = useState<BricksScene | undefined>();

  // Store the scene when ready
  useEffect(() => {
    EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
      console.log("přišla scéna!", scene_instance);
      setScene(scene_instance as BricksScene);
    });

    return () => {
      EventBus.removeListener("current-scene-ready");
    };
  }, [phaserRef, setScene]);

  

  const restore = (composition: CompositionSnapshotType) => {
    if (scene) {
      scene.compositions.restoreSnapshot(composition, movement);
    }
  };

  const fall = () => {
    if (scene) {
      scene.fall();
    }
  };

  const store = ( name: string, person: string ) => {
    if (scene) {
      scene.compositions.storeCurrentComposition(name, person);
    }
  };

  const shuffle = () => {
    if (scene) {
      scene.shuffle();
    }
  };

  const menuRef = useMemo( () => {

    return document.getElementById( "monnomHeader_links" )!;

  }, [] );



    const compositionsOffcanvas = useOffcanvas();

  return (
    <div className={styles.container}>
      <PhaserGame ref={phaserRef} />

      {createPortal( <>
        <button onClick={ compositionsOffcanvas.open } className="monnom-header__link">Uložené kompozice</button>
        <button onClick={shuffle} className="monnom-header__link">Shuffle</button>
        <MovementRadio
            value={movement}
            onChange={(key) => {
              setMovement(key as BrickMovements);
            }}
          />
      </>,
      menuRef

      )}

      <CompositionClearButton fn={fall} on={controller.hasComposition && controller.compositionChanged}/>

      <CompositionStoreButton fn={( message: string, person: string ) => {
        store( message, person );
        compositionsOffcanvas.open();
      }} on={controller.hasComposition}/>

      <Offcanvas label={"Jsem"} control={compositionsOffcanvas}>
        <div style={{overflow: "scroll", height: "100%"}}>
        <CompositionStore compositions={controller.compositions} restore={restore} onRestore={compositionsOffcanvas.close} />
        </div>
      </Offcanvas>



      
    </div>
  );
};
