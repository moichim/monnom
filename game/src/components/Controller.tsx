import { useEffect, useRef, useState } from "react";
import { EventBus, GameEvents } from "../game/EventBus";
import { BrickMovements } from "../game/objects/Brick";
import { CompositionSnapshotType } from "../game/scene/CompositionManager";
import { IRefPhaserGame, PhaserGame } from "../game/PhaserGame";
import { BricksScene } from "../game/scene/BricksScene";
import { MovementRadio } from "./movement/movementRadio";
import { CompositionPopover } from "./state/CompositionsPopover";
import React from "react";

import styles from "./Controller.module.css"

export const Controller: React.FC = () => {
  const [movement, setMovement] = useState<BrickMovements>(
    BrickMovements.NATURAL
  );

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
        setCompositions([...compositions, composition]);
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

  const store = () => {
    if (scene) {
      scene.compositions.storeCurrentComposition("Some ID");
    }
  };

  const shuffle = () => {
    if (scene) {
      scene.shuffle();
    }
  };

  return (
    <div className={styles.container}>
      <PhaserGame ref={phaserRef} />

      <header>
        <div>
          <button onClick={store}>Store</button>
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

      
    </div>
  );
};
