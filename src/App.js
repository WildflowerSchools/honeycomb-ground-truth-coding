import React, { useRef, useEffect } from "react"
import { Switch } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute"
import { useAuth0 } from "./react-auth0-spa"

import NavBar from "./components/NavBar"
import ClassroomSelect from "./pages/ClassroomSelect"
import ClassroomVideo from "./pages/ClassroomVideo"
import { Container, Row } from "react-bootstrap"

function Index(props) {
  const { isAuthenticated, loginWithRedirect, loading } = useAuth0()
  const ref = useRef()

  useEffect(() => {
    const fn = async () => {
      if (loading === false && !isAuthenticated) {
        await loginWithRedirect({})
      }
    }
    fn()
  }, [isAuthenticated, loginWithRedirect, loading])

  return (
    <div ref={ref} className="wfs-app">
      {!isAuthenticated && (
        <Container style={{ marginTop: "100px" }}>
          <Row className="justify-content-md-center">
            <div>Loading...</div>
          </Row>
        </Container>
      )}
      {isAuthenticated && (
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
