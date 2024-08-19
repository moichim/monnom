import Phaser from "phaser";
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useWindowSize } from "usehooks-ts";
import { EventBus } from "./EventBus";
import { BricksScene } from "./scene/BricksScene";
import StartGame from "./StartGame";

import { setLoading } from "../utils/loader";
import style from "./PhaserGame.module.scss";
import { Button } from "@headlessui/react";
import classNames from "classnames";



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

    const { width = window.innerWidth, height = window.innerHeight } = useWindowSize();

    const [on, setOn] = useState<boolean>(false);
    const [initialised, setInitialised] = useState<boolean>(false);
    const [isZoom, setIsZoom] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(1);
    const [targetScale, setTargetScale] = useState<number>(1);

    const startScene = useCallback(() => {

      destroyScene();

      game.current = StartGame("gameContainer");
      if (typeof ref === "function") {
        ref({ game: game.current, scene: new BricksScene() });
      } else if (ref) {
        ref.current = { game: game.current, scene: new BricksScene() };
      }

      const newScale = getScale();

      if ( newScale !== null ) {
        setTargetScale( newScale );
      }

      setScale( 1 );
      setIsZoom( false );

    }, [game, ref, width, height]);

    const destroyScene = () => {
      setLoading(true);

      if (game.current) {

        game.current.scene.sleep("Game");
        game.current.destroy(true);
      }
    }

    const getScale = () => {
      if (game.current) {
        if (game.current.canvas.height) {
          return ( 
            ( window.innerHeight - 100 )
            / game.current.canvas.height
          )
        }
      }
      return null;
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

      const newScale = getScale();

      if ( newScale !== null ) {
        setTargetScale( newScale );
      }

      EventBus.on("current-scene-ready", () => {

        // Set this layout as ON
        setOn(true);

        // Initialise when not initialised
        if (!initialised) {
          setInitialised(true);
        }

      });

      const listener = (event: KeyboardEvent): void => {
        console.log(event.key);

        if ( event.key === "~" ) {
          if ( isZoom === true ) {
            zoomOut();
          } else if (isZoom === false) {
            zoomIn();
          }
        }

      };
      window.addEventListener( "keydown", listener )

      return () => {
        EventBus.removeListener("current-scene-ready");
        window.removeEventListener( "keydown", listener );
      };
    }, [isZoom, targetScale]);

    
    // Everytime the scale changes, propagate it to the dom
    useEffect(() => {

      if (game.current) {
        game.current.canvas.style.scale = scale.toString();
      }

    }, [scale, game]);

    const zoomIn = () => {
      setIsZoom( true );
      setScale( targetScale );
    }

    const zoomOut = () => {
      setIsZoom( false );
      setScale( 1 );
    }

    return (
      <div
        className={classNames(style.container, isZoom ? style.container_out : style.container_in)}
        style={{
          transform: `translateY( ${on ? 0 : "20vh"} )`,
          opacity: on ? 1 : 0,
          position: "relative",
        }}
      >
        <Button
          style={{ position: "fixed", left: 0, top: "5rem", zIndex: 999999, display: "none"}}
          onClick={() => { isZoom
            ? zoomOut()
            : zoomIn() 
          }}
        >Zoom</Button>
        <div id="gameContainer"></div>
      </div>
    );
  }
);
