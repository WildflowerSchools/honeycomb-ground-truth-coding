import React, { useRef, useEffect } from "react"
import { useAuth0 } from "./react-auth0-spa"
import { Container } from "react-bootstrap"
import { Route, Switch, useHistory } from "react-router-dom"

import NavBar from "./components/NavBar"
import ClassroomSelect from "./pages/ClassroomSelect"
import ClassroomVideo from "./pages/ClassroomVideo"
import Login from "./pages/Login"

import PrivateRoute from "./components/PrivateRoute"

function Index() {
  const { isAuthenticated, loginWithRedirect, loading } = useAuth0()
  const history = useHistory()
  const ref = useRef()

  useEffect(() => {
    let isCancelled = false

    const fn = async () => {
      if (!isCancelled && loading === false && !isAuthenticated) {
        console.log("Redirecting to login")
        history.push("/login")
      }
    }
    fn()

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated, loginWithRedirect, loading])

  return (
    <div ref={ref} className="wfs-app">
      {loading && (
        <Container style={{ marginTop: "100px" }}>
          <div>Loading...</div>
        </Container>
      )}
      {!loading && !isAuthenticated && (
        <Container style={{ marginTop: "100px" }}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="*" component={ClassroomSelect} />
          </Switch>
        </Container>
      )}
      {!loading && isAuthenticated && (
        <div>
          <NavBar />
          <Container style={{ marginTop: "100px" }}>
            <Switch>
              <PrivateRoute
                path="/classrooms/:classroomId/:videoDate"
                component={ClassroomVideo}
              />
              <PrivateRoute
                path="/classrooms/:classroomId"
                component={ClassroomSelect}
              />
              <PrivateRoute path="*" component={ClassroomSelect} />
            </Switch>
          </Container>
        </div>
      )}
    </div>
  )
}

export default Index
