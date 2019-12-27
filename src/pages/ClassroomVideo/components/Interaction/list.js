import React, { useState } from "react"
import { Button, Card, Container, Dropdown, DropdownButton,  Row, Table } from "react-bootstrap"

import Modal from "./modal"

import "./list.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEye,
  faPen,
  faToolbox,
  faTrash
} from "@fortawesome/free-solid-svg-icons"

function Index(props) {
  const [showModal, setShowModal] = useState(false)

  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)

  return (
    <Card className="bg-white" style={{ marginTop: "30px", minHeight: "300px" }}>
      {/*<Container>*/}
      {/*  <Row className="justify-content-md-center">*/}
      {/*    <Button variant="primary" size="md" onClick={handleShowModal}>*/}
      {/*      Add Engagement*/}
      {/*    </Button>*/}
      {/*  </Row>*/}
      {/*</Container>*/}
      <Table striped bordered hover size="sm" responsive="sm">
        <thead>
          <tr>
            <th>Child</th>
            <th>Material</th>
            <th>Start</th>
            <th>Duration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Johnny</td>
            <td>Pink Tower</td>
            <td>10:35 AM</td>
            <td>5 minutes</td>
            <td>
                <DropdownButton
                  size="sm"
                  variant="secondary"
                  title={<FontAwesomeIcon icon={faEye} />}
                  className="caret-off"
                >
                    <Dropdown.Item onClick={() => {console.log("edit")}}><FontAwesomeIcon icon={faPen} /></Dropdown.Item>
                    <Dropdown.Item onClick={() => {console.log("delete")}}><FontAwesomeIcon icon={faTrash} /></Dropdown.Item>
                </DropdownButton>
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        show={showModal}
        setShow={setShowModal}
        handleClose={handleCloseModal}
        handleShow={handleShowModal}
      />
    </Card>
  )
}

export default Index
