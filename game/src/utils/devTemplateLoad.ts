const bodyClassApp = "monnom-app";
const bodyClassMounted = "monnom-app__mounted";
const devId = "monnomDev";

const isBodyPrepared = () => {
    return document.body.classList.contains( bodyClassMounted );
}

const getContainer = () => {
    return document.getElementById( devId );
}

export const prepareBody = async () => {

    if ( ! isBodyPrepared() ) {

        const container = getContainer();

        if ( container === null ) {
            throw new Error( "Dev container is not present!" );
        } else {

            const promise = await fetch( "/template.html" );

            if ( promise.status !== 200 ) {
                throw new Error( "The template was not found!" );
            } else {
                const html = await promise.text();
                container.innerHTML = html;
                document.body.classList.add( bodyClassApp );
                document.body.classList.add( bodyClassMounted );
            }

        }

    }

}