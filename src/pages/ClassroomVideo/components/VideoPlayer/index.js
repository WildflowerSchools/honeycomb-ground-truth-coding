import React, { useState } from "react"
import {
  Container,
  Col,
  DropdownButton,
  Dropdown,
  ResponsiveEmbed,
  Row
} from "react-bootstrap"
import DatePicker from "react-datepicker"
import { subDays } from "date-fns"
import ReactHLS from "react-hls-player"
import { useAuth0 } from "../../../../react-auth0-spa"

function Index(props) {
  const [startDate, setStartDate] = useState(subDays(new Date(), 1))
  const [videoElement, setVideoElement] = useState()
  const [videoHeight, setVideoHeight] = useState()
  const [videoWidth, setVideoWidth] = useState()

  const { loading, token } = useAuth0()

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
          {!loading && (
            <ResponsiveEmbed aspectRatio="4by3">
              <ReactHLS
                hlsConfig={{
                  xhrSetup: function(xhr, url) {
                    //xhr.withCredentials = true; // send cookies
                    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
                  }
                }}
                controls={true}
                url={`${process.env.VIDEO_STREAM_URL}/capucine-001/cc-1/output.m3u8`}
              />
            </ResponsiveEmbed>
          )}
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        {[...Array(8)].map((_, ii) => {
          return (
            <Col xs={4} md={3} key={ii} style={{ paddingTop: "10px" }}>
              <ResponsiveEmbed aspectRatio="16by9">
                <iframe width="420" height="315" src="" allowFullScreen />
              </ResponsiveEmbed>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default Index
