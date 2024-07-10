import {
  Popover,
  PopoverButton,
  PopoverPanel
} from "@headlessui/react";
import React, { useMemo } from "react";
import { useWindowSize } from "usehooks-ts";
import { CompositionSnapshotType } from "../../game/scene/CompositionManager";
import { SceneState } from "./SceneState";

type CompositionPopoverProps = {
  compositions: CompositionSnapshotType[];
  restore: (composition: CompositionSnapshotType) => void
};

export const CompositionPopover: React.FC<CompositionPopoverProps> = (
  props
) => {

  const { width = 0, height = 0 } = useWindowSize();

  const filtered = useMemo(() => {

    return props.compositions.filter(composition => {
      console.log(composition.dimension.composition);
      return composition.dimension.composition.width < (width - 100)
        && composition.dimension.composition.height < (height - 200)
      // && composition.dimension.composition.width > ( width - 200 )
      // && composition.dimension.composition.height > ( height - 200 )
    })

  }, [width, height, props.compositions]);


  return (
    <>
      {filtered.length > 0 &&
        <Popover
          color="foreground"
        >

          {({ close }) => {

            return <>
              <PopoverButton>Compositions</PopoverButton>
              <PopoverPanel>
                <div className="flex flex-col gap-2">
                  {filtered.map((composition) => (
                    <SceneState
                      key={composition.id}
                      onClick={() => {
                        // setIsOpen(false);
                        close();
                        props.restore(composition);
                      }}
                      snapshot={composition}
                    ></SceneState>
                  ))}
                </div>
              </PopoverPanel>
            </>

          }}


          {/*
        <PopoverButton>
          <Button color="primary">
            Compositions
          </Button>
        </PopoverButton>
        <PopoverPanel>
            <div className="flex flex-col gap-2">
              {filtered.map((composition) => (
                <SceneState
                  key={composition.id}
                  onClick={() => {
                    // setIsOpen(false);
                    props.restore(composition);
                  }}
                  snapshot={composition}
                ></SceneState>
              ))}
            </div>
        </PopoverPanel>
          */}


        </Popover>

      }
    </>
  );
};
