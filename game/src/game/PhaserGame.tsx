import Phaser from "phaser";
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";
import { BricksGame } from "./scenes/Game";
import { useWindowSize } from "usehooks-ts";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
  ({ currentActiveScene }, ref) => {
    const game = useRef<Phaser.Game | null>(null);

    console.log(currentActiveScene);

    const { width = window.innerWidth, height = window.innerHeight } = useWindowSize();

    const [on, setOn] = useState<boolean>(false);
    const [initialised, setInitialised] = useState<boolean>(false);

    const startScene = useCallback(() => {

      destroyScene();

      // if ( game.current !== null ) {
      game.current = StartGame("gameContainer");
      if (typeof ref === "function") {
        ref({ game: game.current, scene: new BricksGame() });
      } else if (ref) {
        ref.current = { game: game.current, scene: new BricksGame() };
      }
      // }
    }, [game, ref, width, height]);

    const destroyScene = () => {

      if (game.current) {
        game.current.scene.sleep("Game");
        game.current.destroy(true);
      }
    }

    useLayoutEffect(() => {

      startScene();

      return () => destroyScene();

    }, [ref]);


    // Whenever the window dimension changes, trigger the reload (if initialised already)
    useEffect(() => {

      let timer: ReturnType<typeof setTimeout> | undefined;

      if (initialised === true) {
        setOn(false);

        timer = setTimeout(() => {
          startScene();
        }, 300);

      }

      return () => {
        clearTimeout(timer);
      }
    }, [width, height]);



    // After the scene is initialised, set new properties
    useEffect(() => {
      EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
        console.log("sceneStarted", scene_instance);

        // Set this layout as ON
        setOn(true);

        // Initialise when not initialised
        if (!initialised) {
          setInitialised(true);
        }

      });

      return () => {
        EventBus.removeListener("current-scene-ready");
      };
    }, []);


    return (
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          transform: `translateY( ${on ? 0 : "20vh"} )`,
          opacity: on ? 1 : 0,
          position: "relative",
        }}
      >
        <div id="gameContainer"></div>
      </div>
    );
  }
);
