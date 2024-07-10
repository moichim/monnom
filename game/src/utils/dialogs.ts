const getDialogComponents = <TriggerType extends HTMLElement>(
    triggerId: string,
    dialogId: string
) => {
    const trigger = document.getElementById( triggerId );
    const dialog = document.getElementById( dialogId );

    if ( ! trigger || ! dialog ) {
        throw new Error( `Dialog components not found! ${triggerId} or ${dialogId}` );
    }

    return {
        trigger: trigger as TriggerType,
        dialog: dialog as HTMLDialogElement
    }
}

export const createDialog = <TriggerType extends HTMLElement>(
    triggerId: string,
    dialogId: string
) => {

    const { trigger, dialog } = getDialogComponents<TriggerType>( triggerId, dialogId );


    const open = () => {
        // dialog.setAttribute( "open", "true" );
        dialog.showModal();
    }

    const close = () => {
        // dialog.removeAttribute( "open" );
        dialog.close();
    }

    trigger.addEventListener( "click", () => open() );



    const closeButton = document.createElement( "button" );
    closeButton.innerHTML = "x";
    closeButton.classList.add( "monnom-dialog__close" );
    closeButton.addEventListener( "click", close );

    dialog.appendChild( closeButton );

    dialog.addEventListener( "click", (event) => {
        if ( event.target === dialog ) {
            close();
        }
    } );

    return {
        trigger,
        dialog,
        open, close
    }

}