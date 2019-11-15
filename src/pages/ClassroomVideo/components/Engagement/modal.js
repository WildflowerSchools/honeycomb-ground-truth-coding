import React, { useState } from "react"
import Form from "./form"
import { Modal, Button } from "react-bootstrap"

function Index(props) {
  const { show, handleClose } = props

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Engagement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Index
