import React, { useState } from "react"
import { Container, Col, Row } from "react-bootstrap"
import queryString from "query-string"

import { InteractionList, InteractionForm } from "./components/Interaction"
import { ROUTE_CLASSROOM_SELECT } from "../../routes"
import { useAuth0 } from "../../react-auth0-spa"
import VideoPlayer from "./components/Video"
import VideoSelect from "./components/Video/video_select"

function Index(props) {
  const {
    match: { params },
    location,
    history,
  } = props

  if (!params.classroomId || !params.videoDate) {
    history.push(ROUTE_CLASSROOM_SELECT(params.classroomId || ""))
  }

  const query = queryString.parse(location.search)

  const { loading } = useAuth0()

  const [activeVideo, setActiveVideo] = useState()
  const [videos, setVideos] = useState([])

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
            setVideos={setVideos}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
          />
        </Col>
        <Col xs={6} md={4}>
          {/*<div*/}
          {/*  className="paper bg-white mt-0"*/}
          {/*  style={{ maxHeight: 500, overflow: "auto" }}*/}
          {/*>*/}
          {!loading && activeVideo && (
            <VideoSelect
              videos={videos}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              activeVideoUrl={activeVideo.url}
            />
          )}
          {/*<InteractionForm />*/}
          {/*</div>*/}
          {/*<InteractionList classroomId={classroomId} videoDate={videoDate} />*/}
        </Col>
      </Row>
    </Container>
  )
}

export default Index
