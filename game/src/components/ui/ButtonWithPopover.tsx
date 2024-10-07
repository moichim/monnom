import React, { CSSProperties, MouseEventHandler, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { ArrowContainer, Popover, PopoverPosition } from "react-tiny-popover";
import { useWindowSize } from "usehooks-ts";

type ButtonPopoverPosition = {
    position: PopoverPosition,
    style?: CSSProperties
}

type ButtonWithPopoverProps = PropsWithChildren & {
    content: React.ReactNode,
    onClick: MouseEventHandler,
    breakpoint: number,
    below: ButtonPopoverPosition,
    above: ButtonPopoverPosition,
    className: string
};

export const ButtonWithPopover: React.FC<ButtonWithPopoverProps> = props => {

    const [ isOpen, setIsOpen ] = useState<boolean>(false);

    const show = useCallback( () => {

        setIsOpen( true );

    }, [setIsOpen] );

    const hide = useCallback( () => {
        setIsOpen( false );
    }, [setIsOpen] );

    const dimensions = useWindowSize();

    const positions: PopoverPosition[] = useMemo(() => {

        if ( dimensions.width < props.breakpoint ) {
            return [props.below.position]
        }

        return [props.above.position]

    },[dimensions.width]);

    const isBelow = useMemo( () => {

        return dimensions.width < props.breakpoint;

    }, [dimensions.width] );

    return <Popover
        isOpen={isOpen}
        positions={positions}
        content={({ position, childRect, popoverRect }) => (
            <ArrowContainer 
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={'yellow'}
              arrowSize={10}
              arrowStyle={{ opacity: 1 }}
              className='popover-arrow-container'
              arrowClassName='popover-arrow'
              style={isBelow ? props.below.style : props.above.style}
            >
              <div
                className="popover-content"
                // style={{ backgroundColor: 'blue', opacity: 0.7 }}
                // onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              >
                {props.content}
              </div>
            </ArrowContainer>
          )}
    >
        <button 
            onMouseEnter={show}
            onMouseLeave={hide}
            onBlur={hide}
            onClick={props.onClick}
            className={props.className}
        >{props.children}</button>
    </Popover>

}