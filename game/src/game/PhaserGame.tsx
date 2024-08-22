import Phaser from "phaser";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { useWindowSize } from "usehooks-ts";
import { EventBus } from "./EventBus";
import { BricksScene } from "./scene/BricksScene";
import StartGame from "./StartGame";

import classNames from "classnames";
import { setLoading } from "../utils/loader";
import style from "./PhaserGame.module.scss";



export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  // currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(

  (props, ref) => {
    props;

    const game = useRef<Phaser.Game | null>(null);

    const { width = window.innerWidth} = useWindowSize();

    const [on, setOn] = useState<boolean>(false);
    const [initialised, setInitialised] = useState<boolean>(false);



    const destroyScene = () => {
      setLoading(true);

      if (game.current) {

        game.current.scene.sleep("Game");
        game.current.destroy(true);

      }
    }

    const startScene = () => {

      // destroy the game when already initialised
      if (initialised) {
        // ~~~~~destroyScene();
      }

      // Calculate the new target scale

      // Create the new instance
      game.current = StartGame("gameContainer");

      if (typeof ref === "function") {
        ref({ game: game.current, scene: new BricksScene() });
      } else if (ref) {
        ref.current = { game: game.current, scene: new BricksScene() };
      }

    };

    // After the scene is initialised, set new properties

    
    // Initial game start
    useLayoutEffect(() => {

      console.log( "Prvotní načtení" );

      startScene();

      EventBus.on("current-scene-ready", () => {

        console.log( "scéna je ready" );

        // Set this layout as ON
        setOn(true);

        // Initialise when not initialised
        if (!initialised) {
          setInitialised(true);
        }

      });

      return () => {
        destroyScene();
        EventBus.removeListener("current-scene-ready");

      }

    }, [ref]);
    




    // Whenever the window dimension changes, trigger the reload (if initialised already)
    useEffect(() => {

      let timer: ReturnType<typeof setTimeout> | undefined;

      if (initialised === true) {
        setOn(false);

        timer = setTimeout(() => {
          destroyScene();
          startScene();
        }, 300);

      }

      return () => {
        clearTimeout(timer);
      }
    }, [width]);

    return (
      <div
        className={classNames(style.container)}
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
