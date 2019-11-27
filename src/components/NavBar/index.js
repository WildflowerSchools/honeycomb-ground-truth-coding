import React from "react"
import { Navbar, Nav, Button, DropdownButton, Dropdown } from "react-bootstrap"

import { useAuth0 } from "../../react-auth0-spa"

function Index(props) {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    })

  return (
    <Navbar
      className="justify-content-between"
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
          <Nav>
            <DropdownButton
              title="Classroom"
              size="lg"
              aria-label="Classroom Select"
            >
              <Dropdown.Item>Capucine</Dropdown.Item>
              <Dropdown.Item>Acorn</Dropdown.Item>
              <Dropdown.Item>Greenbrier</Dropdown.Item>
            </DropdownButton>
            <Nav.Link
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
