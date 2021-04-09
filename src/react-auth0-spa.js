import React, { useState, useEffect, useContext } from "react"
import { useCookies } from "react-cookie"
import createAuth0Client from "@auth0/auth0-spa-js"

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname)

const JWT_COOKIE_NAME = "wf.jwt"

export const Auth0Context = React.createContext()
export const useAuth0 = () => useContext(Auth0Context)
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [user, setUser] = useState()
  const [auth0Client, setAuth0] = useState()
  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)
  const [error, setError] = useState()

  const [, setCookie, removeCookie] = useCookies([JWT_COOKIE_NAME])

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0 = await createAuth0Client(initOptions)
      setAuth0(auth0)

      // const { appState } = await auth0.handleRedirectCallback()
      // console.log(appState)
      if (
        (window.location.search.includes("code=") &&
          window.location.search.includes("state=")) ||
        window.location.search.includes("error=")
      ) {
        try {
          const { appState } = await auth0.handleRedirectCallback()
          console.log("Okay?")
          onRedirectCallback(appState)
          setError(null)
        } catch (e) {
          console.warn(`${e.error}: ${e.error_description}`)
          setError(e)
        }
      }

      const isAuthenticated = await auth0.isAuthenticated()
      setIsAuthenticated(isAuthenticated)
      if (isAuthenticated) {
        const user = await auth0.getUser()
        setUser(user)
      }

      setLoading(false)
    }

    initAuth0()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const updateJWTCookie = async () => {
      if (isAuthenticated) {
        const token = await auth0Client.getTokenSilently()
        const domain = `${window.location.hostname
          .split(".")
          .slice(-2)
          .join(".")}`
        setCookie(JWT_COOKIE_NAME, token, {
          secure: true,
          domain: domain,
          path: "/",
        })
      } else {
        removeCookie(JWT_COOKIE_NAME)
      }
    }
    updateJWTCookie()
  }, [isAuthenticated])

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true)
    try {
      await auth0Client.loginWithPopup(params)
    } catch (error) {
      console.error(error)
    } finally {
      setPopupOpen(false)
    }
    const user = await auth0Client.getUser()
    setUser(user)
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    console.log("handleRedirectCallback")
    setLoading(true)
    await auth0Client.handleRedirectCallback()
    const user = await auth0Client.getUser()
    setLoading(false)
    setIsAuthenticated(true)
    setUser(user)
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        error,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}
