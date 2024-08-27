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
import { ButtonWithPopover } from "./ui/ButtonWithPopover";
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

  const compositionsOffcanvas = useOffcanvas();

  const menuRef = useMemo(() => {
    return document.getElementById("monnomHeader_links")!;
  }, []);




  return (
    <div className={styles.container}>
      <PhaserGame ref={phaserRef} />

      {createPortal(<>
        <div className="monnom-header__separator"></div>

<div className="monnom-header__controls">
        <ButtonWithPopover
          content={<>Gallery of user designs</>}
          onClick={() => { compositionsOffcanvas.open() }}
          breakpoint={900}
          className="monnom-header__link"
          below={{
            position: "bottom",
            style: {display: "none"}
          }}
          above={{
            position: "bottom"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
          </svg>
        </ButtonWithPopover>

        <ButtonWithPopover
          content={<>Shuffle the bricks</>}
          onClick={() => { shuffle() }}
          className="monnom-header__link"
          breakpoint={900}
          below={{
            position: "bottom",
            style: {display: "none"}
          }}
          above={{
            position: "bottom"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: "1.5rem", height: "1.5rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </ButtonWithPopover>

        <ButtonWithPopover
          content={<>{controller.isZoom ? "Zoom in" : "Zoom out"}</>} 
          className="monnom-header__link"
          onClick={() => {
            if (scene) {
              if (scene.isZoomIn) {
                scene.zoomOut();
              } else {
                scene.zoomIn();
              }
            }
          }}
          breakpoint={900}
          below={{
            position: "bottom",
            style: {display: "none"}
          }}
          above={{
            position: "bottom"
          }}
        >
          {controller.isZoom === false ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: "1.5rem", height: "1.5rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
          </svg>
            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: "1.5rem", height: "1.5rem" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
            </svg>
          }
        </ButtonWithPopover>
        </div>
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
