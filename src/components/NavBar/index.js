import React from "react"
import { Navbar, Nav, Button, DropdownButton, Dropdown } from "react-bootstrap"
import { useQuery } from "@apollo/react-hooks"

import { GET_ENVIRONMENTS } from "../../clients/Honeycomb/queries"
import { useAuth0 } from "../../react-auth0-spa"

function Index(props) {
  const {
    loading: environmentsLoading,
    error: environmentsError,
    data: environmentsData
  } = useQuery(GET_ENVIRONMENTS)
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
            {environmentsLoading && <div>Loading...</div>}
            {!environmentsLoading && !environmentsError && environmentsData && (
              <DropdownButton
                title="Classroom"
                size="lg"
                aria-label="Classroom Select"
              >
                {environmentsData.environments.data.map(environment => (
                  <Dropdown.Item key={environment.environment_id}>
                    {environment.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            )}
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
