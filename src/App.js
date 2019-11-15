import React, { useRef } from "react"

import NavBar from "./components/NavBar"
import ClassroomVideo from "./pages/ClassroomVideo"
import Container from "react-bootstrap/Container"

function Index(props) {
  const ref = useRef()

  return (
    <div ref={ref} className="wfs-app">
      <NavBar />
      <Container style={{ marginTop: "50px" }}>
        <ClassroomVideo />
      </Container>
    </div>
  )
}

export default Index
