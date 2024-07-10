import React from 'react'
import ReactDOM from 'react-dom/client'
import { Site } from './components/Site.tsx'
import './index.scss'
import { isDev } from './utils/assetUrl.ts'
import { prepareBody } from './utils/devTemplateLoad.ts'
import { createDialog } from './utils/dialogs.ts'

const init = () => {

  createDialog<HTMLDivElement>( "monnomContactTrigger", "monnomContactDialog" );

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
