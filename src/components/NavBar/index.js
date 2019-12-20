import React from "react"
import { Navbar, Nav, Button } from "react-bootstrap"
import TimezoneDropdown from "../Timezones/TimezoneDropdown"
import { useAuth0 } from "../../react-auth0-spa"

function Index(props) {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    })

  return (
    <Navbar
      className="justify-content-between fixed-top"
      aria-label="Navigation Bar with Classroom Select"
    >
      <Navbar.Brand>Wildflower Schools: Ground Truth Coding</Navbar.Brand>
      <div>
        {!isAuthenticated && (
          <Nav>
            <Button
              id="qsLoginBtn"
              color="primary"
              className="btn-margin"
              onClick={() => loginWithRedirect({})}
            >
              Log in
            </Button>
          </Nav>
        )}
        {isAuthenticated && (
          <Nav className="align-items-center">
            <TimezoneDropdown as={Nav.Item} className={"mr-3"} />
            <Nav.Link
              className={"mr-3"}
              id="qsLogoutBtn"
              href="#logout"
              onClick={() => logoutWithRedirect()}
            >
              Log out
            </Nav.Link>
          </Nav>
        )}
      </div>
    </Navbar>
  )
}

export default Index
