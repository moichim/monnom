import { useEffect, useMemo, useRef, useState } from "react";
import { EventBus, GameEvents } from "../game/EventBus";
import { BrickMovements } from "../game/objects/Brick";
import { CompositionSnapshotType } from "../game/scene/CompositionManager";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { BricksScene } from "../game/scene/BricksScene";
import { MovementRadio } from "./movement/movementRadio";
import { CompositionPopover } from "./state/CompositionsPopover";
import React from "react";

import styles from "./Controller.module.css"
import { createPortal } from "react-dom";
import { CompositionClearButton } from "./compositions/CompositionClearButton";
import { Offcanvas, useOffcanvas } from "./compositions/ui/offcanvas";
import { CompositionStore } from "./state/CompositionsStore";
import { CompositionStoreButton } from "./compositions/CompositionStoreButton";
import { useController } from "./useController";

export const Controller: React.FC = () => {
  const [movement, setMovement] = useState<BrickMovements>(
    BrickMovements.NATURAL
  );


  const controller = useController();


  // Reference to the Phaser instance
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  // Reference to the scene
  const [scene, setScene] = useState<BricksScene | undefined>();

  // Stored compositions array
  const [compositions, setCompositions] = useState<CompositionSnapshotType[]>(
    []
  );

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

  // Store the composition when ready
  useEffect(() => {
    EventBus.on(
      GameEvents.COMP_STORED,
      (composition: CompositionSnapshotType) => {
        console.log(composition);
        setCompositions([composition, ...compositions ]);
      }
    );

    return () => {
      EventBus.removeListener(GameEvents.COMP_STORED);
    };
  }, [compositions, setCompositions]);


  // Listen to load of compositions
  useEffect(() => {
    EventBus.on(
      GameEvents.COMPS_RESTORED,
      (comps: CompositionSnapshotType[]) => {
        setCompositions(comps);
      }
    );

    return () => {
      EventBus.removeListener(GameEvents.COMP_STORED);
    };
  }, [compositions, setCompositions]);

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

  const store = ( name: string ) => {
    if (scene) {
      scene.compositions.storeCurrentComposition(name);
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


  const [hasComposition, setHasComposition] = useState<boolean>( false );

    // Reflect has composition
    useEffect( () => {

      EventBus.on( GameEvents.HAS_COMPOSITION, ( value: boolean ) => {
        setHasComposition( value );
      } );

    }, [] );

    const [compositionChanged, setCompositionChanged] = useState<boolean>( false );

    // Reflect has composition
    useEffect( () => {

      EventBus.on( GameEvents.COMP_CHANGED, ( value: boolean ) => {
        setCompositionChanged( value );
      } );

    }, [] );



    const compositionsOffcanvas = useOffcanvas();

  return (
    <div className={styles.container}>
      <PhaserGame ref={phaserRef} />

      {createPortal( <>
        <button onClick={ compositionsOffcanvas.open }>Offcanvas</button>
      <header>
        <div>
          <button onClick={fall}>Fall</button>
          <button onClick={shuffle}>Shuffle</button>
          
          <CompositionPopover compositions={compositions} restore={restore} />
        </div>
        <div>
          <MovementRadio
            value={movement}
            onChange={(key) => {
              setMovement(key as BrickMovements);
            }}
          />
        </div>
      </header>
      </>,
      menuRef

      )}

      <CompositionClearButton fn={fall} on={hasComposition && compositionChanged}/>

      <CompositionStoreButton fn={( message: string ) => {
        store( message );
        compositionsOffcanvas.open();
      }} on={hasComposition}/>

      <Offcanvas label={"Jsem"} control={compositionsOffcanvas}>
        <CompositionStore compositions={compositions} restore={restore} onRestore={compositionsOffcanvas.close} />
      </Offcanvas>



      
    </div>
  );
};
