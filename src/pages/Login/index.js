import React, { useEffect } from "react"
import { useAuth0 } from "../../react-auth0-spa"
import { Container, Row, Button } from "react-bootstrap"

import Alert from "react-bootstrap/Alert"

function Index() {
  const { error, loginWithRedirect, logout } = useAuth0()

  const styles = {
    buttonMargin: { margin: "5px" },
  }

  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <Container>
      <Row className="justify-content-md-center align-items-center">
        {error ? (
          <div>
            <Alert variant={"danger"}>{error.error_description}</Alert>
            <Row className="justify-content-md-center align-items-center">
              <Button
                id="qsTryAgainBtn"
                variant="primary"
                className="btn-margin"
                style={styles.buttonMargin}
                onClick={() => loginWithRedirect({})}
              >
                Try again
              </Button>
              <Button
                id="qsLogoutBtn"
                variant="danger"
                className="btn-margin"
                style={styles.buttonMargin}
                onClick={() => logout({})}
              >
                Log out
              </Button>
            </Row>
          </div>
        ) : (
          <Button
            id="qsLoginBtn"
            variant="primary"
            className="btn-margin"
            onClick={() => loginWithRedirect({})}
          >
            Log in
          </Button>
        )}
      </Row>
    </Container>
  )
}

export default Index
