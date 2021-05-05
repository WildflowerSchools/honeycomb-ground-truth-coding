import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { Route } from "react-router-dom"
import { useAuth0 } from "../../react-auth0-spa"

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  useEffect(() => {
    let isCancelled = false

    const fn = async () => {
      if (!isCancelled) {
        if (!isAuthenticated) {
          await loginWithRedirect({
            appState: { targetUrl: path },
          })
        }
      }
    }
    fn()

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated, loginWithRedirect, path])

  const render = (props) =>
    isAuthenticated === true ? <Component {...props} /> : null

  return <Route path={path} render={render} {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
}

export default PrivateRoute
