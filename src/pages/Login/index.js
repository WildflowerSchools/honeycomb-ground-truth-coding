import React from "react"
import { Container, Row, Button } from "react-bootstrap"
import { useAuth0 } from "../../react-auth0-spa"

function Index(props) {
  const { loginWithRedirect } = useAuth0()

  return (
    <Container>
      <Row className="justify-content-md-center align-items-center">
        <Button
          id="qsLoginBtn"
          color="primary"
          className="btn-margin"
          onClick={() => loginWithRedirect({})}
        >
          Log in
        </Button>
      </Row>
    </Container>
  )
}

export default Index
