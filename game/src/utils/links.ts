const getLinkTarget = (
    targetId: string
) => {

    const target = document.getElementById( targetId );

    if ( ! target ) {
        throw new Error( `Link target ${ targetId } not found!` );
    }

    return target as HTMLLinkElement;

}

type WindowMock = {
    monnomPortfolio?: string,
    monnomFacebook?: string,
    monnomInstagram?: string,
    monnomLinkedin?: string
}

const getVariableValue = ( variableName: string ) => {

    const win = window as WindowMock;

    if ( variableName in win ) {
        return win[variableName as keyof WindowMock] as string;
    }

    return undefined;

}


export const assignLink = (
    targetId: string,
    variableName: string,
    isBlank: boolean = true
) => {

    const value = getVariableValue( variableName );
    const target = getLinkTarget( targetId );

    if ( target && value ) {
        target.href = value;
        if ( isBlank ) {
            target.setAttribute( "target", "_blank" );
        }
    } else if ( !value ) {
        target.style.display = "none";
    }

}