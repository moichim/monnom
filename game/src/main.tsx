import React from 'react'
import ReactDOM from 'react-dom/client'
import { Site } from './components/Site.tsx'
import './index.scss'
import { isDev } from './utils/assetUrl.ts'
import { prepareBody } from './utils/devTemplateLoad.ts'
import { assignLink } from './utils/links.ts'
import { classOpen, createOffcanvas } from './utils/offcanvas.ts'

const init = () => {

  const contact = createOffcanvas( "monnomContactTrigger", "monnomContactOffcanvas", "monnom-offcanvas__half" );
  const about = createOffcanvas( "monnomAboutTrigger", "monnomAboutOffcanvas", "monnom-offcanvas__full" );

  const closeAllOffcanvases = () => {
    contact.close();
    about.close();
  }

  const logos = document.getElementsByClassName( "monnom-header__logo" );


  for ( let logo of logos ) {

    logo.addEventListener( "click", () => {
      if ( about.container.classList.contains( classOpen ) ) {

        closeAllOffcanvases();

      } else {
        about.open();
      }
    } );

  }

  assignLink( "monnomPortfolioLink", "monnomPortfolio" );
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

if (isDev) {

  // Fetch the template, prepare the body and after that, init React
  prepareBody()
    .then(() => init());

} else {

  // Init right now
  init();

}
