import React from "react"
import { Navbar, DropdownButton, Dropdown } from "react-bootstrap"

function Index(props) {
  return (
    <Navbar
      className="justify-content-between"
      aria-label="Navigation Bar with Classroom Select"
    >
      <Navbar.Brand>Wildflower Schools: Ground Truth Coding</Navbar.Brand>
      <DropdownButton title="Classroom" size="lg" aria-label="Classroom Select">
        <Dropdown.Item>Capucine</Dropdown.Item>
        <Dropdown.Item>Acorn</Dropdown.Item>
        <Dropdown.Item>Greenbrier</Dropdown.Item>
      </DropdownButton>
    </Navbar>
  )
}

export default Index
