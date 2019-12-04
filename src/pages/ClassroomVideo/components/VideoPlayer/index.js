import React, { useEffect, useState } from "react"
import {
  Container,
  Col,
  DropdownButton,
  Dropdown,
  ResponsiveEmbed,
  Row
} from "react-bootstrap"
import axios from "axios"
import DatePicker from "react-datepicker"
import { subDays } from "date-fns"
import ReactHLS from "react-hls-player"
import { useAuth0 } from "../../../../react-auth0-spa"

function HLSStream(props) {
  const { streamURL, token } = props

  const ready = streamURL !== undefined

  return (
    <ResponsiveEmbed aspectRatio="4by3">
      {ready ? (
        <ReactHLS
          hlsConfig={{
            xhrSetup: function(xhr, url) {
              xhr.setRequestHeader("Authorization", `Bearer ${token}`)
            }
          }}
          controls={true}
          url={streamURL}
        />
      ) : (
        <div />
      )}
    </ResponsiveEmbed>
  )
}

function Index(props) {
  const [startDate, setStartDate] = useState(subDays(new Date(), 1))
  const [activeVideo, setActiveVideo] = useState()
  const [videos, setVideos] = useState([])
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()

  const { isAuthenticated, loading, token } = useAuth0()

  useEffect(() => {
    const fn = async () => {
      if (loading === false && isAuthenticated) {
        const result = await axios(
          `${process.env.VIDEO_STREAM_URL}?classroom=capucine&date=2019-11-06`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        setVideos(result.data["videos"])

        if (result.data["videos"].length > 0) {
          setActiveVideo(result.data["videos"][0].url)
        }

        setStartTime(result.data["start"])
        setEndTime(result.data["end"])
      }
    }
    fn()
  }, [
    isAuthenticated,
    loading,
    token,
    setVideos,
    setActiveVideo,
    setStartTime,
    setEndTime
  ])

  return (
    <Container>
      <Row className="justify-content-between">
        <Col>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            maxDate={subDays(new Date(), 1)}
          />
        </Col>
        <Col className="justify-content-end">
          <Container>
            <Row className="justify-content-end">
              <h5>10:50 AM</h5>
              <DropdownButton variant="outline-dark">
                <Dropdown.Item>EST</Dropdown.Item>
                <Dropdown.Item>CST</Dropdown.Item>
                <Dropdown.Item>MST</Dropdown.Item>
                <Dropdown.Item>PST</Dropdown.Item>
              </DropdownButton>
            </Row>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col lg>
          {!loading && <HLSStream streamURL={activeVideo} token={token} />}
        </Col>
      </Row>
      {!loading && (
        <Row style={{ marginTop: "20px" }}>
          {videos.map((video, ii) => {
            return (
              <Col xs={4} md={3} key={ii} style={{ paddingTop: "10px" }}>
                <HLSStream streamURL={video.url} token={token} />
              </Col>
            )
          })}
        </Row>
      )}
    </Container>
  )
}

export default Index
