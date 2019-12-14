import React, { useState } from "react"
import { Container, Col, Row } from "react-bootstrap"

import { InteractionList } from "./components/Interaction"
import VideoPlayer from "./components/VideoPlayer"
import { ROUTE_CLASSROOM_SELECT } from "../../../../routes"

function Index(props) {
  const {
    match: { params },
    history
  } = props

  if (!params.classroomId || !params.videoDate) {
    history.push(ROUTE_CLASSROOM_SELECT(params.classroomId || ""))
  }

  const [classroomId, setClassroomId] = useState(params.classroomId)
  const [videoDate, setVideoDate] = useState(params.videoDate)

  return (
    <Container>
      <Row>
        <Col xs={12} md={8}>
          <VideoPlayer classroomId={classroomId} videoDate={videoDate} />
        </Col>
        <Col xs={6} md={4}>
          <InteractionList classroomId={classroomId} videoDate={videoDate} />
        </Col>
      </Row>
    </Container>
  )
}

export default Index
