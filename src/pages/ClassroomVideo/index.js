import React, { useState } from "react"
import { Container, Col, Row } from "react-bootstrap"
import queryString from "query-string"

import { InteractionList, InteractionForm } from "./components/Interaction"
import VideoPlayer from "./components/Video"
import { ROUTE_CLASSROOM_SELECT } from "../../routes"

function Index(props) {
  const {
    match: { params },
    location,
    history
  } = props

  if (!params.classroomId || !params.videoDate) {
    history.push(ROUTE_CLASSROOM_SELECT(params.classroomId || ""))
  }

  const query = queryString.parse(location.search)

  const [classroomId, setClassroomId] = useState(params.classroomId)
  const [videoDate, setVideoDate] = useState(params.videoDate)
  const [videoTime, setVideoTime] = useState(query.time || null)
  const [deviceName, setDeviceName] = useState(query.device || null)

  return (
    <Container>
      <Row>
        <Col xs={12} md={8}>
          <VideoPlayer
            classroomId={classroomId}
            videoDate={videoDate}
            deviceName={deviceName}
            videoTime={videoTime}
          />
        </Col>
        <Col xs={6} md={4}>
          <div
            className="paper bg-white mt-0"
            style={{ maxHeight: 500, overflow: "auto" }}
          >
            <InteractionForm />
          </div>
          <InteractionList classroomId={classroomId} videoDate={videoDate} />
        </Col>
      </Row>
    </Container>
  )
}

export default Index
