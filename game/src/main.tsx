import React from 'react'
import ReactDOM from 'react-dom/client'
import { Site } from './components/Site.tsx'
import './index.scss'
import { isDev } from './utils/assetUrl.ts'
import { prepareBody } from './utils/devTemplateLoad.ts'
import { assignLink } from './utils/links.ts'

const init = () => {

  // const contact = createOffcanvas( "monnomContactTrigger", "monnomContactOffcanvas", "monnom-offcanvas__half" );
  // const about = createOffcanvas( "monnomAboutTrigger", "monnomAboutOffcanvas", "monnom-offcanvas__full" );

  /*
  const closeAllOffcanvases = () => {
    contact.close();
    about.close();
  }
  */

  // const logos = document.getElementsByClassName( "monnom-header__logo" );

/*
  for ( let logo of logos ) {

    logo.addEventListener( "click", () => {
      if ( about.container.classList.contains( classOpen ) ) {

        closeAllOffcanvases();

      } else {
        about.open();
      }
    } );

  }
    */

  // assignLink( "monnomPortfolioLink", "monnomPortfolio", false );
  assignLink( "monnomFacebookLink", "monnomFacebook" );
  assignLink( "monnomInstagramLink", "monnomInstagram" );
  assignLink( "monnomLinkedinLink", "monnomLinkedin" );

  const menu = document.getElementById("monnomHeader");

  if ( menu ) {
    setTimeout( () => menu.classList.add( "monnom-header__on" ), 500 );
  }

  ReactDOM.createRoot(document.getElementById('gameRoot')!).render(
    <React.StrictMode>
      <Site />
    </React.StrictMode>,
  )
}

// React dev server needs to fetch the template file first and then it needs to initialise
if (isDev) {
  prepareBody()
    .then(() => init());

} 
// If not dev server, initialise right now only on pages with game peage tempalte
else if ( document.body.classList.contains( "page-template-game" ) ) {
  init();

}
