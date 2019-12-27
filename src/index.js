/** @format */

import React from "react"
import ReactDOM from "react-dom"
import { Auth0Provider } from "./react-auth0-spa"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
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

const authConfig = {
  "audience": process.env.HONEYCOMB_AUDIENCE || "https://honeycomb.api.wildflowerschools.org",
  "clientId": process.env.AUTH0_CLIENT_ID || "jDm6KBz3czRMo5MGI6KcVTmvtUXxzmnE",
  "domain":  process.env.AUTH0_DOMAIN || "wildflowerschools.auth0.com",
  "responseType": "token id_token",
  "scope": "openid profile video:view"
}

ReactDOM.render(
  <Auth0Provider
    domain={authConfig.domain}
    client_id={authConfig.clientId}
    redirect_uri={window.location.origin}
    audience={authConfig.audience}
    response_type={authConfig.responseType}
    scope={authConfig.scope}
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
