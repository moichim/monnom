import { useState, useEffect } from "react";
import { EventBus, GameEvents } from "../game/EventBus";
import { CompositionSnapshotType } from "../game/scene/CompositionManager";

export const useController = () => {


    // Stored compositions array
    const [compositions, setCompositions] = useState<CompositionSnapshotType[]>([]);

    // Store the composition when ready
    useEffect(() => {
        EventBus.on(
            GameEvents.COMP_STORED,
            (composition: CompositionSnapshotType) => {
                console.log(composition);
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
            GameEvents.COMPS_RESTORED,
            (comps: CompositionSnapshotType[]) => {
                setCompositions(comps);
            }
        );

        return () => {
            EventBus.removeListener(GameEvents.COMP_STORED);
        };
    }, [compositions, setCompositions]);



    const [hasComposition, setHasComposition] = useState<boolean>(false);

    // Reflect has composition
    useEffect(() => {

        EventBus.on(GameEvents.HAS_COMPOSITION, (value: boolean) => {
            setHasComposition(value);
        });

    }, []);

    const [compositionChanged, setCompositionChanged] = useState<boolean>(false);

    // Reflect has composition
    useEffect(() => {

        EventBus.on(GameEvents.COMP_CHANGED, (value: boolean) => {
            setCompositionChanged(value);
        });

    }, []);

    return {
        hasComposition,
        compositionChanged,
        compositions
    }



}