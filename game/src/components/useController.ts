import { useState, useEffect } from "react";
import { EventBus, GameEvents } from "../game/EventBus";
import { CompositionSnapshotType } from "../game/scene/CompositionManager";
import { CompositionState } from "../game/scene/BricksScene";
import { useWindowSize } from "usehooks-ts";

export const useController = () => {


    // Stored compositions array
    const [compositions, setCompositions] = useState<CompositionSnapshotType[]>([]);
    const [state, setState] = useState<CompositionState>( CompositionState.NONE );

    const { width = window.innerWidth, height = window.innerHeight } = useWindowSize();

    useEffect(() => {

        setState( CompositionState.NONE );

      }, [width, height]);

    // Store the composition when ready
    useEffect(() => {
        EventBus.on(
            GameEvents.COMP_STORED,
            (composition: CompositionSnapshotType) => {
                setCompositions([composition, ...compositions]);
            }
        );

        return () => {
            EventBus.removeListener(GameEvents.COMP_STORED);
        };
    }, [compositions, setCompositions]);



    // Listen to load of compositions
    useEffect(() => {
        EventBus.on(
            GameEvents.COMPS_LOADED,
            (comps: CompositionSnapshotType[]) => {
                setCompositions(comps);
            }
        );

        return () => {
            EventBus.removeListener(GameEvents.COMP_STORED);
        };
    }, [compositions, setCompositions]);



    

    // Reflect has composition
    useEffect( () => {

        EventBus.on(
            GameEvents.COMP_STATE,
            ( value: CompositionState ) => {
                setState( value );
            }
        );

    }, [] );

    return {
        compositions,
        state
    }



}