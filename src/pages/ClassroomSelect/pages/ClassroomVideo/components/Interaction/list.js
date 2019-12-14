import React, { useState } from "react"
import { Button, Card, Container, Row, Table } from "react-bootstrap"

import Modal from "./modal"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlay,
  faPen,
  faToolbox,
  faTrash
} from "@fortawesome/free-solid-svg-icons"

function Index(props) {
  const [showModal, setShowModal] = useState(false)

  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Button variant="primary" size="md" onClick={handleShowModal}>
            Add Engagement
          </Button>
        </Row>
      </Container>
      <Card style={{ marginTop: "30px", minHeight: "300px" }}>
        <Table striped bordered hover size="sm" responsive="sm">
          <thead>
            <tr>
              <th>Child</th>
              <th>Material</th>
              <th>Start</th>
              <th>End</th>
              <th>
                <FontAwesomeIcon icon={faToolbox} />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Johnny</td>
              <td>Pink Tower</td>
              <td>10:35 AM</td>
              <td>10:44 AM</td>
              <td>
                <Container>
                  <Row className="justify-content-between">
                    <a href="#">
                      <FontAwesomeIcon icon={faPlay} />
                    </a>
                    <a href="#">
                      <FontAwesomeIcon icon={faPen} />
                    </a>
                    <a href="#">
                      <FontAwesomeIcon icon={faTrash} />
                    </a>
                  </Row>
                </Container>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
      <Modal
        show={showModal}
        setShow={setShowModal}
        handleClose={handleCloseModal}
        handleShow={handleShowModal}
      />
    </div>
  )
}

export default Index
