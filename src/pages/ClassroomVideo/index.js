import React from "react"
import { Container, Col, Row } from "react-bootstrap"

import { EngagementList } from "./components/Engagement"
import VideoPlayer from "./components/VideoPlayer"

function Index(props) {
  return (
    <Container>
      <Row>
        <Col xs={12} md={6}>
          <VideoPlayer />
        </Col>
        <Col xs={6} md={6}>
          <EngagementList />
        </Col>
      </Row>
    </Container>
  )
}

export default Index
