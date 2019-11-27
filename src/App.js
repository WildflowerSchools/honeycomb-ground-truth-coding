import React, { useRef, useEffect } from "react"

import { useAuth0 } from "./react-auth0-spa"

import NavBar from "./components/NavBar"
import ClassroomVideo from "./pages/ClassroomVideo"
import { Container, Row } from "react-bootstrap"

function Index(props) {
  const ref = useRef()

  const { isAuthenticated, loginWithRedirect, loading } = useAuth0()

  useEffect(
    () => {
      const fn = async () => {
        if (loading === false && !isAuthenticated) {
          await loginWithRedirect({})
        }
      }
      fn()
    },
    [isAuthenticated, loginWithRedirect, loading]
  )

  return (
    <div ref={ref} className="wfs-app">
      <NavBar />
      <Container style={{ marginTop: "50px" }}>
        {isAuthenticated && <ClassroomVideo />}
        {!isAuthenticated && (
          <Row className="justify-content-md-center">
            <div>Loading...</div>
          </Row>
        )}
      </Container>
    </div>
  )
}

export default Index
