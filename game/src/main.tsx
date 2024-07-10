import React from 'react'
import ReactDOM from 'react-dom/client'
import { Site } from './components/Site.tsx'
import './index.scss'
import { isDev } from './utils/assetUrl.ts'
import { prepareBody } from './utils/devTemplateLoad.ts'
import { assignLink } from './utils/links.ts'
import { createOffcanvas } from './utils/offcanvas.ts'

const init = () => {

  createOffcanvas( "monnomContactTrigger", "monnomContactOffcanvas" );

  assignLink( "monnomPortfolioLink", "monnomPortfolio" );
  assignLink( "monnomFacebookLink", "monnomFacebook" );
  assignLink( "monnomInstagramLink", "monnomInstagram" );
  assignLink( "monnomLinkedinLink", "monnomLinkedin" );

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
