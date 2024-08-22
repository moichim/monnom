import React, { useEffect, useMemo, useRef, useState } from "react";
import { EventBus } from "../game/EventBus";
import { BrickMovements } from "../game/objects/Brick";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { BricksScene, CompositionState } from "../game/scene/BricksScene";
import { CompositionSnapshotType } from "../game/scene/CompositionManager";

import { createPortal } from "react-dom";
import { CompositionClearButton } from "./compositions/CompositionClearButton";
import { CompositionStoreButton } from "./compositions/CompositionStoreButton";
import styles from "./Controller.module.css";
import { CompositionStore } from "./state/CompositionsStore";
import { Offcanvas, useOffcanvas } from "./ui/offcanvas";
import { useController } from "./useController";

export const Controller: React.FC = () => {
  const [movement] = useState<BrickMovements>(
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

  const store = (name: string, person: string) => {
    if (scene) {
      scene.compositions.storeCurrentComposition(name, person);
    }
  };

  const shuffle = () => {
    if (scene) {
      scene.shuffle();
    }
  };

  const buttonRef = useMemo(() => {
    return document.getElementById("monnomCompositionsLink")!;
  }, []);

  const menuRef = useMemo(() => {
    return document.getElementById("monnomHeader_links")!;
  }, []);


  const compositionsOffcanvas = useOffcanvas();

  return (
    <div className={styles.container}>
      <PhaserGame ref={phaserRef} />

      {createPortal(<>
        <span onClick={compositionsOffcanvas.open} className="monnom-header__link">Uložené kompozice</span>
      </>,
        buttonRef

      )}

      {createPortal(<>
        <button onClick={shuffle} className="monnom-header__link monnom-header__link__control"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: "1.5rem", height: "1.5rem" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        </button>
        <button
          className="monnom-header__link monnom-header__link__control"
          onClick={() => {
            if (scene) {
              if (scene.isZoomIn) {
                scene.zoomOut();
              } else {
                scene.zoomIn();
              }
            }
          }}>{controller.isZoom === false ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: "1.5rem", height: "1.5rem" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
        </svg>
         : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: "1.5rem", height: "1.5rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
          </svg>
          }</button>
      </>,
        menuRef

      )}

      {/*<CompositionShuffleButton fn={shuffle} on={true} /> */}

      <CompositionClearButton fn={fall} on={controller.state === CompositionState.HAS || controller.state === CompositionState.CHANGED} />

      <CompositionStoreButton fn={(message: string, person: string) => {
        store(message, person);
        compositionsOffcanvas.open();
      }} on={controller.state === CompositionState.CHANGED} />

      <Offcanvas label={"Visitors' creations"} control={compositionsOffcanvas}>

        <CompositionStore compositions={controller.compositions} restore={restore} onRestore={compositionsOffcanvas.close} />

      </Offcanvas>

    </div>
  );
};
