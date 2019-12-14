/** @format */

import React from "react"
import ReactDOM from "react-dom"
import { Auth0Provider } from "./react-auth0-spa"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import config from "./auth_config.json"
import history from "./utils/history"
import { HoneycombProvider } from "./apis/Honeycomb"
import { SettingsProvider } from "./settings"

import "react-datepicker/dist/react-datepicker.css"
import "react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css"

// import * as serviceWorker from './serviceWorker'

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  )
}

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    audience={config.audience}
    response_type={config.responseType}
    scope={config.scope}
    onRedirectCallback={onRedirectCallback}
  >
    <BrowserRouter>
      <SettingsProvider>
        <HoneycombProvider>
          <App />
        </HoneycombProvider>
      </SettingsProvider>
    </BrowserRouter>
  </Auth0Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()
