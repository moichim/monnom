<?php

function monnom_after_body_content() {

    ?>

<style>

    .monnom_cover {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        transition: opacity .5s ease-in-out;
        content: "";
        background-color: var( --wp--preset--color--base );
        z-index: 999;
    }

    .monnom_cover::after {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transition: all .5s ease-in-out;
        content: "";
        background-image: url("<?= get_theme_file_uri(); ?>/assets/monnom-logo.svg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 4rem;
        background-attachment: fixed;
        z-index: 999;
    }

body .wp-site-blocks {
    transition: all .3s ease-in-out;
    z-index: 1;
    opacity: 0;
    /** transform: translateY( 8rem );*/
}

body .monnom-fadeouter {
    transform: translateY( -8rem);
}

body.incomed .monnom-fadeouter {
    transform: translateY( 0 );
}

body.incomed .wp-site-blocks {
    transform: translateY( 0 );
    opacity: 1;
}

.monnom-fadeouter {

    transition: transform .3s ease-in-out;
}

</style>

<script>

    window.addEventListener( "load", () => {
        console.log( "loaded!" );
        const fader = document.querySelector( ".monnom_cover" );
        fader.style.opacity = 0;
        setTimeout( () => {
            document.body.classList.add( "incomed" );
            const fader = document.querySelector( ".monnom_cover" );
            fader.style.width = "0px";
            fader.style.height = "0px";
        }, 500 );
    } );


const goOut = (url) => {


    document.body.classList.remove( "incomed" );
    const fader = document.querySelector( ".monnom_cover" );
    fader.style.backgroundColor = "yellow";
    fader.style.opacity = 1;
    fader.style.width = "100vw";
    fader.style.height = "100vh";
    setTimeout( () => {
        window.location.href = url;
    }, 500 );

}

window.addEventListener("click", event => {

    if ( event.target.tagName === "A" ) {
        console.log( event.target.href );
        if ( event.target.target === "_blank" ) {
            // do nothing
        } else {
            event.preventDefault();
            goOut( event.target.href );
        }
    }

});

</script>

    <?php

    ?>

    <div class="monnom_cover"></div>

    <?php



    if ( is_monnom() ) {

        ?>
            <div class="monnom_fader">
        <?php
        return;
    }

    ?>

    <div class="monnom_fader">

    <div class="monnom-header__backdrop"></div>

    <a class="monnom-fadeouter monnom-header__logo" href="<?= home_url(); ?>">
        <svg id="Vrstva_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124.59 113.41">
                <g id="Vrstva_1-2" data-name="Vrstva_1">
                    <g>
                        <path
                            d="M83.47,44.59c.44-.02.83-.05,1.22-.06,3.11,0,6.22.04,9.32-.03.98-.02,1.52.31,1.92,1.2,1.57,3.53,3.2,7.03,4.81,10.54.99,2.17,1.99,4.33,3.08,6.71.64-1.32,1.21-2.47,1.75-3.63,2.13-4.63,4.25-9.26,6.37-13.89.23-.5.47-.9,1.11-.9,3.63.02,7.25.02,10.88.04.07,0,.15.05.22.08.39.9.45,38.39.04,39.65h-10.82c-.24-3.36-.08-6.66-.11-9.95-.03-3.31,0-6.61-.18-9.98-.89,1.96-1.78,3.92-2.66,5.88-1.02,2.25-2.07,4.48-3.04,6.75-.39.91-.96,1.24-1.94,1.17-1.15-.08-2.31-.05-3.47,0-.76.02-1.2-.19-1.54-.97-1.77-4.05-3.62-8.06-5.45-12.08-.11-.25-.26-.49-.59-.72v19.89h-10.85c-.33-.89-.41-38.15-.07-39.7Z" />
                        <path
                            d="M30.54,40v-19.89c-.09-.02-.17-.03-.26-.05-.72,1.58-1.44,3.15-2.16,4.73-1.25,2.76-2.49,5.51-3.72,8.28-.26.6-.67.82-1.31.8-1.31-.03-2.63-.05-3.95,0-.86.04-1.27-.33-1.6-1.09-1.83-4.15-3.71-8.28-5.58-12.42-.05-.11-.13-.2-.4-.29v19.91H.62V.36c.43-.04.85-.11,1.27-.11,3.15,0,6.3.03,9.45-.03.95-.02,1.44.34,1.81,1.18,2.45,5.45,4.94,10.88,7.42,16.31.11.25.27.48.5.89.56-1.15,1.08-2.16,1.55-3.19,2.16-4.7,4.32-9.41,6.47-14.12.28-.61.59-1.06,1.4-1.05,3.39.04,6.78.02,10.16.02.23,0,.46.06.8.11v39.63h-10.9Z" />
                        <path
                            d="M113.32,19.76V.34h10.82c.39.97.46,38.21.08,39.61-.19.04-.41.14-.63.14-2.43.01-4.86.05-7.29-.02-.46-.01-1.03-.4-1.35-.78-2.19-2.63-4.32-5.31-6.48-7.98-2.73-3.38-5.45-6.76-8.18-10.13-.07-.08-.17-.13-.4-.28v19.09h-10.78c-.34-.92-.4-38.24-.06-39.59.19-.04.41-.13.64-.13,2.35-.01,4.7,0,7.05-.02.63,0,1.01.28,1.38.76,4.67,5.95,9.37,11.88,14.06,17.81.28.36.59.7.88,1.05.08-.03.17-.07.25-.1Z" />
                        <path
                            d="M.73,44.53c1.82,0,3.62.16,5.39-.04,2.24-.25,3.61.6,4.95,2.38,4.17,5.53,8.54,10.91,12.84,16.35.26.33.55.64,1.01,1.16v-19.72h10.99v39.58c-.35.05-.69.13-1.03.13-2.23.01-4.46-.02-6.7.02-.78.02-1.26-.32-1.71-.88-4.77-5.93-9.54-11.85-14.32-17.77-.09-.12-.22-.21-.59-.54v19.09H.79c-.34-.9-.42-38.18-.06-39.77Z" />
                        <path
                            d="M84.38,20.28c-.18,7.35-3.15,13.27-9.37,17.3-4.22,2.74-8.92,3.63-13.85,2.38-7.37-1.87-11.97-6.7-14.1-13.88-2.03-6.84-.88-13.25,3.58-18.82C55.3,1.45,61.46-.97,68.87.35c5.55.99,9.62,4.25,12.49,8.99,2.02,3.34,3.04,6.99,3.02,10.93ZM73.08,20.86c0-2.95-.35-5.09-1.43-7.06-1.42-2.61-3.6-3.93-6.6-3.88-2.95.05-5.04,1.53-6.23,4.08-1.9,4.06-1.93,8.26-.04,12.35,1.19,2.57,3.33,4.07,6.19,4.22,2.71.13,4.86-1.05,6.31-3.36,1.36-2.15,1.78-4.57,1.8-6.34Z" />
                        <path
                            d="M78.91,64.99c-.53,7.68-3.82,14.1-11.2,17.82-7.73,3.89-16.59,1.97-22.14-4.77-5-6.07-6.38-13-3.8-20.51,2.15-6.24,6.38-10.58,12.72-12.46,6.2-1.84,12.02-.73,17.03,3.53,4.91,4.18,7.09,9.66,7.39,16.39ZM51.79,64.29c.06,2.55.5,4.75,1.64,6.78,2.75,4.91,9.41,5.07,12.35.28.98-1.59,1.46-3.34,1.63-5.19.28-3.12-.03-6.12-1.78-8.83-2.67-4.15-8.83-4.03-11.38-.62-1.76,2.36-2.31,5-2.46,7.58Z" />
                        <path
                            d="M68.3,113.11c-.4-1.41-.34-23.18,0-24.12,4.59-.06,9.24-.85,13.72.65,4.42,1.48,6.7,4.84,7.28,9.33.38,2.96,0,5.89-1.49,8.57-1.6,2.85-4.1,4.6-7.23,5.21-4.05.78-8.17.24-12.29.36ZM74.85,107.12c3.63.44,5.14-.05,6.91-2.75,1.32-2.01.98-5.79-.41-7.74-1.09-1.52-3.78-2.32-6.49-1.7v12.2Z" />
                        <path
                            d="M113.08,88.78c4.71-.32,8.86,3.28,10.4,7.04,1.92,4.69,1.35,9.12-1.64,13.09-4.72,6.25-13.94,5.9-18.15-.74-3.82-6.01-2.65-12.56,2.17-16.78,1.9-1.66,4.18-2.76,7.23-2.61ZM108.36,100.94c.12.87.17,1.75.38,2.59.48,1.87,2.32,3.53,3.78,3.74,2.23.32,3.77-1.35,4.49-3.03.93-2.17.94-4.41.08-6.65-1.22-3.16-5.28-3.9-7.36-1.29-1.07,1.34-1.36,2.95-1.37,4.64Z" />
                        <path
                            d="M57.83,88.93h6.65c.06.43.16.77.15,1.12-.04,4.26.02,8.53-.18,12.79-.13,2.68-.81,5.28-2.78,7.33-2.63,2.72-5.91,3.45-9.52,3.09-2.91-.29-5.33-1.55-7.09-3.93-1.45-1.96-2.06-4.27-2.15-6.61-.16-4.34-.05-8.69-.05-13.03,0-.19.06-.39.12-.71h6.52c.04.44.13.89.13,1.35.01,3.55-.02,7.1.02,10.64.01,1.03.13,2.08.38,3.07.39,1.56,1.93,3.71,4.2,3.21.55-.12,1.12-.39,1.55-.75,1.38-1.18,1.96-2.73,1.95-4.55-.03-3.83,0-7.65.01-11.48,0-.47.06-.93.1-1.52Z" />
                        <path
                            d="M0,110.66c1.03-2.18,1.93-4.11,2.87-6.1.35.12.62.18.86.3,1.36.65,2.66,1.47,4.08,1.93,1.14.37,2.41.36,3.63.41.28.01.74-.38.82-.67.09-.35-.03-.89-.27-1.15-.3-.33-.8-.49-1.24-.66-2.18-.85-4.42-1.56-6.55-2.54-2.21-1.01-3.18-3.01-3.14-5.35.06-4.32,2.62-7.07,6.6-7.93,3.94-.85,7.55.4,11.02,2.16.1.05.19.15.4.32-.93,1.79-1.85,3.57-2.73,5.28-1.71-.63-3.28-1.27-4.9-1.78-.66-.21-1.43-.27-2.11-.15-.45.08-1.01.51-1.18.92-.09.22.43.94.82,1.1,1.54.62,3.15,1.09,4.72,1.66,2,.72,3.99,1.51,5.1,3.49,1.87,3.33,1.23,9.34-4.29,10.93-3.59,1.03-7.1.56-10.57-.55-1.31-.42-2.55-1.04-3.93-1.62Z" />
                        <path
                            d="M40.97,88.95v5.73h-6.67v18.33h-6.76c-.05-.55-.14-1.08-.15-1.62-.01-5.02,0-10.04,0-15.06,0-.47,0-.94,0-1.57h-6.66v-5.81h20.25Z" />
                        <path d="M92.35,88.91h6.31c.35.93.42,22.7.08,24.1h-6.34c-.33-.9-.4-22.7-.05-24.1Z" />
                    </g>
                </g>
            </svg>
    </a>

    <div class="monnom-fadeouter monnom-header__backlink" >
        <button onclick="(function backOrHome(event){
            event.preventDefault();
            const home = '<?php echo home_url();?>';
            const previous = document.referrer;

            if ( previous.includes( home ) ) {
                goOut( previous );
            } else {
                goOut( home );
            }

        })(event)">×</button>
    </div>

    <?php

}

add_action('wp_body_open', 'monnom_after_body_content');

function monnom_before_body_content() {

    if ( is_monnom() ) {
        ?>
            </div>
        <?php
        return;
    }

    ?>

    <footer class="monnom-footer">
        <div class="monnom-footer__wrapper">

            <a class="monnom-footer__logo" href="<?= home_url(); ?>">
                <svg id="Vrstva_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124.59 113.41">
                        <g id="Vrstva_1-2" data-name="Vrstva_1">
                            <g>
                                <path
                                    d="M83.47,44.59c.44-.02.83-.05,1.22-.06,3.11,0,6.22.04,9.32-.03.98-.02,1.52.31,1.92,1.2,1.57,3.53,3.2,7.03,4.81,10.54.99,2.17,1.99,4.33,3.08,6.71.64-1.32,1.21-2.47,1.75-3.63,2.13-4.63,4.25-9.26,6.37-13.89.23-.5.47-.9,1.11-.9,3.63.02,7.25.02,10.88.04.07,0,.15.05.22.08.39.9.45,38.39.04,39.65h-10.82c-.24-3.36-.08-6.66-.11-9.95-.03-3.31,0-6.61-.18-9.98-.89,1.96-1.78,3.92-2.66,5.88-1.02,2.25-2.07,4.48-3.04,6.75-.39.91-.96,1.24-1.94,1.17-1.15-.08-2.31-.05-3.47,0-.76.02-1.2-.19-1.54-.97-1.77-4.05-3.62-8.06-5.45-12.08-.11-.25-.26-.49-.59-.72v19.89h-10.85c-.33-.89-.41-38.15-.07-39.7Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M30.54,40v-19.89c-.09-.02-.17-.03-.26-.05-.72,1.58-1.44,3.15-2.16,4.73-1.25,2.76-2.49,5.51-3.72,8.28-.26.6-.67.82-1.31.8-1.31-.03-2.63-.05-3.95,0-.86.04-1.27-.33-1.6-1.09-1.83-4.15-3.71-8.28-5.58-12.42-.05-.11-.13-.2-.4-.29v19.91H.62V.36c.43-.04.85-.11,1.27-.11,3.15,0,6.3.03,9.45-.03.95-.02,1.44.34,1.81,1.18,2.45,5.45,4.94,10.88,7.42,16.31.11.25.27.48.5.89.56-1.15,1.08-2.16,1.55-3.19,2.16-4.7,4.32-9.41,6.47-14.12.28-.61.59-1.06,1.4-1.05,3.39.04,6.78.02,10.16.02.23,0,.46.06.8.11v39.63h-10.9Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M113.32,19.76V.34h10.82c.39.97.46,38.21.08,39.61-.19.04-.41.14-.63.14-2.43.01-4.86.05-7.29-.02-.46-.01-1.03-.4-1.35-.78-2.19-2.63-4.32-5.31-6.48-7.98-2.73-3.38-5.45-6.76-8.18-10.13-.07-.08-.17-.13-.4-.28v19.09h-10.78c-.34-.92-.4-38.24-.06-39.59.19-.04.41-.13.64-.13,2.35-.01,4.7,0,7.05-.02.63,0,1.01.28,1.38.76,4.67,5.95,9.37,11.88,14.06,17.81.28.36.59.7.88,1.05.08-.03.17-.07.25-.1Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M.73,44.53c1.82,0,3.62.16,5.39-.04,2.24-.25,3.61.6,4.95,2.38,4.17,5.53,8.54,10.91,12.84,16.35.26.33.55.64,1.01,1.16v-19.72h10.99v39.58c-.35.05-.69.13-1.03.13-2.23.01-4.46-.02-6.7.02-.78.02-1.26-.32-1.71-.88-4.77-5.93-9.54-11.85-14.32-17.77-.09-.12-.22-.21-.59-.54v19.09H.79c-.34-.9-.42-38.18-.06-39.77Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M84.38,20.28c-.18,7.35-3.15,13.27-9.37,17.3-4.22,2.74-8.92,3.63-13.85,2.38-7.37-1.87-11.97-6.7-14.1-13.88-2.03-6.84-.88-13.25,3.58-18.82C55.3,1.45,61.46-.97,68.87.35c5.55.99,9.62,4.25,12.49,8.99,2.02,3.34,3.04,6.99,3.02,10.93ZM73.08,20.86c0-2.95-.35-5.09-1.43-7.06-1.42-2.61-3.6-3.93-6.6-3.88-2.95.05-5.04,1.53-6.23,4.08-1.9,4.06-1.93,8.26-.04,12.35,1.19,2.57,3.33,4.07,6.19,4.22,2.71.13,4.86-1.05,6.31-3.36,1.36-2.15,1.78-4.57,1.8-6.34Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M78.91,64.99c-.53,7.68-3.82,14.1-11.2,17.82-7.73,3.89-16.59,1.97-22.14-4.77-5-6.07-6.38-13-3.8-20.51,2.15-6.24,6.38-10.58,12.72-12.46,6.2-1.84,12.02-.73,17.03,3.53,4.91,4.18,7.09,9.66,7.39,16.39ZM51.79,64.29c.06,2.55.5,4.75,1.64,6.78,2.75,4.91,9.41,5.07,12.35.28.98-1.59,1.46-3.34,1.63-5.19.28-3.12-.03-6.12-1.78-8.83-2.67-4.15-8.83-4.03-11.38-.62-1.76,2.36-2.31,5-2.46,7.58Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M68.3,113.11c-.4-1.41-.34-23.18,0-24.12,4.59-.06,9.24-.85,13.72.65,4.42,1.48,6.7,4.84,7.28,9.33.38,2.96,0,5.89-1.49,8.57-1.6,2.85-4.1,4.6-7.23,5.21-4.05.78-8.17.24-12.29.36ZM74.85,107.12c3.63.44,5.14-.05,6.91-2.75,1.32-2.01.98-5.79-.41-7.74-1.09-1.52-3.78-2.32-6.49-1.7v12.2Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M113.08,88.78c4.71-.32,8.86,3.28,10.4,7.04,1.92,4.69,1.35,9.12-1.64,13.09-4.72,6.25-13.94,5.9-18.15-.74-3.82-6.01-2.65-12.56,2.17-16.78,1.9-1.66,4.18-2.76,7.23-2.61ZM108.36,100.94c.12.87.17,1.75.38,2.59.48,1.87,2.32,3.53,3.78,3.74,2.23.32,3.77-1.35,4.49-3.03.93-2.17.94-4.41.08-6.65-1.22-3.16-5.28-3.9-7.36-1.29-1.07,1.34-1.36,2.95-1.37,4.64Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M57.83,88.93h6.65c.06.43.16.77.15,1.12-.04,4.26.02,8.53-.18,12.79-.13,2.68-.81,5.28-2.78,7.33-2.63,2.72-5.91,3.45-9.52,3.09-2.91-.29-5.33-1.55-7.09-3.93-1.45-1.96-2.06-4.27-2.15-6.61-.16-4.34-.05-8.69-.05-13.03,0-.19.06-.39.12-.71h6.52c.04.44.13.89.13,1.35.01,3.55-.02,7.1.02,10.64.01,1.03.13,2.08.38,3.07.39,1.56,1.93,3.71,4.2,3.21.55-.12,1.12-.39,1.55-.75,1.38-1.18,1.96-2.73,1.95-4.55-.03-3.83,0-7.65.01-11.48,0-.47.06-.93.1-1.52Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M0,110.66c1.03-2.18,1.93-4.11,2.87-6.1.35.12.62.18.86.3,1.36.65,2.66,1.47,4.08,1.93,1.14.37,2.41.36,3.63.41.28.01.74-.38.82-.67.09-.35-.03-.89-.27-1.15-.3-.33-.8-.49-1.24-.66-2.18-.85-4.42-1.56-6.55-2.54-2.21-1.01-3.18-3.01-3.14-5.35.06-4.32,2.62-7.07,6.6-7.93,3.94-.85,7.55.4,11.02,2.16.1.05.19.15.4.32-.93,1.79-1.85,3.57-2.73,5.28-1.71-.63-3.28-1.27-4.9-1.78-.66-.21-1.43-.27-2.11-.15-.45.08-1.01.51-1.18.92-.09.22.43.94.82,1.1,1.54.62,3.15,1.09,4.72,1.66,2,.72,3.99,1.51,5.1,3.49,1.87,3.33,1.23,9.34-4.29,10.93-3.59,1.03-7.1.56-10.57-.55-1.31-.42-2.55-1.04-3.93-1.62Z" fill="currentcolor" stroke="none"/>
                                <path
                                    d="M40.97,88.95v5.73h-6.67v18.33h-6.76c-.05-.55-.14-1.08-.15-1.62-.01-5.02,0-10.04,0-15.06,0-.47,0-.94,0-1.57h-6.66v-5.81h20.25Z" fill="currentcolor" stroke="none"/>
                                <path d="M92.35,88.91h6.31c.35.93.42,22.7.08,24.1h-6.34c-.33-.9-.4-22.7-.05-24.1Z" fill="currentcolor"  stroke="none"/>
                            </g>
                        </g>
                    </svg>
            </a>

            <div>

                <?php print_monnom_footer_menu(); ?>
            </div>

        </div>

    </footer>

    </div>

    <?php

}

add_action('wp_footer', 'monnom_before_body_content');